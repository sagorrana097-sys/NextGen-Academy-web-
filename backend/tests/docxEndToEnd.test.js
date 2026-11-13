/**
 * NextGen Academy — End-to-End DOCX Embedded Image Extraction & Persistence Verification
 * 
 * Verifies the entire production pipeline:
 * 1. Generates genuine DOCX binary with embedded PNG image + CQ1 + subquestions (ক/খ/গ/ঘ) + CQ2 (no image)
 * 2. Runs binary extraction through storage abstraction
 * 3. Parses questions into structured CQ models
 * 4. Verifies CQ 1 possesses diagram, CQ 2 has no diagram and NO image bleed
 * 5. Persists to QuestionBank database
 * 6. Simulates backend restart and verifies persistent image file exists on disk
 * 7. Simulates cross-domain frontend rendering (getAssetUrl)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const mammoth = require('mammoth');
const { storage } = require('../services/storageService');
const { parseQuestionsFromDocument } = require('../services/questionParserService');
const { QuestionBank, globalDB } = require('../models');

async function buildDocxFixture() {
  const zip = new JSZip();
  // Valid 1x1 base64 PNG pixel (blue)
  const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAEfQHzx5t0RAAAAABJRU5ErkJggg==', 'base64');

  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Default Extension="png" ContentType="image/png"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '</Types>');

  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '</Relationships>');

  zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rIdImage1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>' +
    '</Relationships>');

  zip.file('word/media/image1.png', pngBuffer);

  const docXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<w:body>' +
    '<w:p><w:r><w:t>CQ 1: নিচের উদ্দীপকটি লক্ষ করো এবং সংশ্লিষ্ট প্রশ্নগুলোর উত্তর দাও:</w:t></w:r></w:p>' +
    '<w:p><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:blipFill><a:blip r:embed="rIdImage1"/></pic:blipFill></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>' +
    '<w:p><w:r><w:t>(ক) বলের সংজ্ঞা দাও।</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(খ) জড়তা বলতে কী বোঝায় ব্যাখ্যা করো।</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(গ) উদ্দীপকের চিত্র হতে ত্বরণ নির্ণয় করো।</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(ঘ) উদ্দীপকের আলোকে ভরবেগের নিত্যতা সূত্র যাচাই করো।</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>CQ 2: দ্বিতীয় সৃজনশীল প্রশ্ন (সম্পূর্ণ টেক্সট ভিত্তিক, কোনো চিত্র নেই):</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(ক) কাজ কাকে বলে?</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(খ) গতিশক্তি কখনো ঋণাত্মক হতে পারে না কেন?</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(গ) ৫০ কেজি ভরের বস্তুকে উপরে তুলতে কৃতকাজ নির্ণয় করো।</w:t></w:r></w:p>' +
    '<w:p><w:r><w:t>(ঘ) শক্তি সংরক্ষণশীলতা নীতি বজায় থাকে কি-না বিশ্লেষণ করো।</w:t></w:r></w:p>' +
    '</w:body></w:document>';

  zip.file('word/document.xml', docXml);
  return zip.generateAsync({ type: 'nodebuffer' });
}

async function runDocxEndToEndTest() {
  console.log('--- Starting DOCX End-to-End Image Verification ---');

  // 1. Build genuine DOCX binary
  const docxBuffer = await buildDocxFixture();
  assert(Buffer.isBuffer(docxBuffer) && docxBuffer.length > 500, 'DOCX fixture must be valid non-empty buffer');
  console.log(`✓ 1. Safe DOCX fixture generated (${docxBuffer.length} bytes)`);

  // 2. Extract embedded images & text via Mammoth + StorageService
  const extractedImages = [];
  let imageCounter = 0;

  const convertImage = mammoth.images.imgElement(async (image) => {
    imageCounter++;
    const imgBuf = await image.read();
    const saved = await storage.save(imgBuf, {
      category: 'extracted_images',
      originalName: `e2e_fixture_img_${imageCounter}`,
      mimeType: image.contentType || 'image/png'
    });

    extractedImages.push({
      index: imageCounter,
      fileName: saved.fileName,
      publicUrl: saved.publicUrl,
      sizeBytes: imgBuf.length
    });

    return {
      src: saved.publicUrl,
      alt: `চিত্র-${imageCounter}`
    };
  });

  const htmlResult = await mammoth.convertToHtml({ buffer: docxBuffer }, { convertImage });
  const rawHtml = htmlResult.value;

  // Transform HTML to structured text preserving ![caption](url) markdown
  const markdownText = rawHtml
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']?([^"'>]*)["']?[^>]*>/gi, (match, src, alt) => {
      return `\n\n![${alt || 'চিত্র'}](${src})\n\n`;
    })
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .trim();

  assert.strictEqual(extractedImages.length, 1, 'Exactly 1 embedded image must be extracted');
  assert(markdownText.includes('![চিত্র-1](/uploads/extracted_images/'), 'Markdown must retain image reference in relative position');
  console.log(`✓ 2. Binary extraction verified: 1 image saved to ${extractedImages[0].publicUrl}`);

  // 3. Question parser creates structured CQs
  const parsedQuestions = parseQuestionsFromDocument(markdownText, {
    classId: 9,
    subjectId: 1,
    board: 'ঢাকা বোর্ড',
    year: '2026'
  });

  assert.strictEqual(parsedQuestions.length, 2, 'Parser must produce exactly 2 questions');
  const cq1 = parsedQuestions[0];
  const cq2 = parsedQuestions[1];

  assert.strictEqual(cq1.questionType, 'CQ', 'Question 1 must be CQ');
  assert.strictEqual(cq2.questionType, 'CQ', 'Question 2 must be CQ');

  // Verify CQ 1 image binding
  assert(cq1.diagramUrl && cq1.diagramUrl.includes('/uploads/extracted_images/'), 'CQ 1 must have diagramUrl bound');
  assert.strictEqual(cq1.diagramUrls.length, 1, 'CQ 1 must have exactly 1 diagram');
  assert.strictEqual(cq1.subQuestions.ka.text, 'বলের সংজ্ঞা দাও।', 'CQ 1 subquestion (ka) matched');
  assert.strictEqual(cq1.subQuestions.gha.text, 'উদ্দীপকের আলোকে ভরবেগের নিত্যতা সূত্র যাচাই করো।', 'CQ 1 subquestion (gha) matched');

  // Verify CQ 2 has NO image bleed
  assert.strictEqual(cq2.diagramUrl, null, 'CQ 2 diagramUrl must be null (NO bleed from CQ 1)');
  assert.strictEqual(cq2.diagramUrls.length, 0, 'CQ 2 diagramUrls must be empty');
  assert.strictEqual(cq2.subQuestions.ka.text, 'কাজ কাকে বলে?', 'CQ 2 subquestion (ka) matched');
  console.log('✓ 3. Spatial question-diagram association verified: CQ 1 has diagram, CQ 2 has NO bleed');

  // 4. Database persistence into QuestionBank
  const createdCQ1 = await QuestionBank.create({
    questionType: cq1.questionType,
    questionText: cq1.questionText,
    stem: cq1.stem,
    subQuestions: cq1.subQuestions,
    diagramUrl: cq1.diagramUrl,
    diagramCaption: cq1.diagramCaption || 'চিত্র-১',
    diagramUrls: cq1.diagramUrls,
    classId: 9,
    subjectId: 1,
    board: 'ঢাকা বোর্ড',
    year: '2026',
    status: 'APPROVED',
    duplicateStatus: 'UNIQUE'
  });

  const createdCQ2 = await QuestionBank.create({
    questionType: cq2.questionType,
    questionText: cq2.questionText,
    stem: cq2.stem,
    subQuestions: cq2.subQuestions,
    diagramUrl: null,
    diagramUrls: [],
    classId: 9,
    subjectId: 1,
    board: 'ঢাকা বোর্ড',
    year: '2026',
    status: 'APPROVED',
    duplicateStatus: 'UNIQUE'
  });

  assert(createdCQ1.id, 'CQ 1 must have generated ID');
  assert(createdCQ2.id, 'CQ 2 must have generated ID');
  console.log(`✓ 4. Database persistence verified: QuestionBank IDs #${createdCQ1.id} and #${createdCQ2.id}`);

  // 5. Backend Restart Simulation: reload database from disk and verify disk image
  if (globalDB && typeof globalDB.load === 'function') {
    globalDB.load();
  }
  const fetchedCQ1 = await QuestionBank.findByPk(createdCQ1.id);
  assert.strictEqual(fetchedCQ1.diagramUrl, cq1.diagramUrl, 'diagramUrl must survive backend reload');

  // Verify physical file on disk exists
  const localFileName = path.basename(fetchedCQ1.diagramUrl);
  const diskPath = path.join(__dirname, '../uploads/extracted_images', localFileName);
  assert(fs.existsSync(diskPath), `Extracted image file must exist on disk at ${diskPath}`);
  console.log(`✓ 5. Persistence across backend restart verified: physical file exists at ${diskPath}`);

  // 6. Cross-domain resolution test (getAssetUrl simulation)
  function getAssetUrl(storedPath, backendOrigin = 'https://api.nextgen-academy.com') {
    if (!storedPath) return null;
    if (storedPath.startsWith('http://') || storedPath.startsWith('https://')) return storedPath;
    const clean = storedPath.startsWith('/') ? storedPath : `/${storedPath}`;
    return `${backendOrigin}${clean}`;
  }

  const crossDomainUrl = getAssetUrl(fetchedCQ1.diagramUrl, 'https://api.nextgen-academy.com');
  assert.strictEqual(crossDomainUrl, `https://api.nextgen-academy.com${fetchedCQ1.diagramUrl}`);
  console.log(`✓ 6. Cross-domain asset URL resolved for Vercel: ${crossDomainUrl}`);

  // Clean up test questions from database
  await QuestionBank.destroy({ where: { id: createdCQ1.id } });
  await QuestionBank.destroy({ where: { id: createdCQ2.id } });
  // Clean up test image
  await storage.delete(fetchedCQ1.diagramUrl);

  console.log('--- All DOCX End-to-End Image Extraction Tests PASSED! ---');
}

if (require.main === module) {
  runDocxEndToEndTest().catch(err => {
    console.error('DOCX E2E Test Failure:', err);
    process.exit(1);
  });
}

module.exports = { runDocxEndToEndTest };
