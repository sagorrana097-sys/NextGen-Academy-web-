/**
 * NextGen Academy — Automated PDF Embedded Diagram Extraction Test Suite
 * 
 * Verifies:
 * - PDF 1: CQ 1 has diagram, CQ 2 has no diagram (No bleed into CQ 2)
 * - PDF 2: CQ with two diagrams preserves vertical order
 * - PDF 3: Image ambiguously positioned between questions is flagged `requiresDiagramReview: true` with provenance
 */

const assert = require('assert');
const zlib = require('zlib');
const { parsePdfQuestionsWithDiagrams, encodePng } = require('../services/pdfDiagramExtractorService');

/**
 * Helper to synthesize valid PDF 1.4 binary buffer with text and image XObjects
 */
function buildSyntheticPdf({ textBlocks = [], images = [] }) {
  const objects = [];
  function addObject(content) {
    objects.push(content);
    return objects.length;
  }

  // Obj 1: Catalog
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  // Obj 2: Pages
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  // Obj 3: Placeholder for Page
  addObject('');
  // Obj 4: Font
  const fontObjNum = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const imgObjRefs = {};
  images.forEach(img => {
    const compressed = zlib.deflateSync(img.rawRgb);
    const header = `<< /Type /XObject /Subtype /Image /Width ${img.imgW} /Height ${img.imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${compressed.length} >>\r\nstream\r\n`;
    const footer = '\r\nendstream';
    imgObjRefs[img.name] = addObject(Buffer.concat([Buffer.from(header, 'binary'), compressed, Buffer.from(footer, 'binary')]));
  });

  let streamParts = [];
  textBlocks.forEach(tb => {
    streamParts.push(`BT /F1 ${tb.size || 12} Tf ${tb.x} ${tb.y} Td (${tb.text.replace(/[()\\]/g, '\\$&')}) Tj ET`);
  });
  images.forEach(img => {
    streamParts.push(`q ${img.width} 0 0 ${img.height} ${img.x} ${img.y} cm /${img.name} Do Q`);
  });

  const streamBuf = Buffer.from(streamParts.join('\r\n'));
  const contentHeader = `<< /Length ${streamBuf.length} >>\r\nstream\r\n`;
  const contentFooter = '\r\nendstream';
  const contentObjNum = addObject(Buffer.concat([Buffer.from(contentHeader, 'binary'), streamBuf, Buffer.from(contentFooter, 'binary')]));

  const xobjDict = Object.entries(imgObjRefs).map(([k, v]) => `/${k} ${v} 0 R`).join(' ');
  objects[2] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjNum} 0 R >> /XObject << ${xobjDict} >> >> /Contents ${contentObjNum} 0 R >>`;

  let offset = 0;
  const chunks = [];
  function writeBuf(b) {
    if (typeof b === 'string') b = Buffer.from(b, 'binary');
    chunks.push(b);
    offset += b.length;
  }

  writeBuf('%PDF-1.4\r\n');
  const xrefOffsets = [0];
  for (let i = 0; i < objects.length; i++) {
    xrefOffsets.push(offset);
    writeBuf(`${i + 1} 0 obj\r\n`);
    writeBuf(objects[i]);
    writeBuf('\r\nendobj\r\n');
  }

  const startxref = offset;
  writeBuf(`xref\r\n0 ${objects.length + 1}\r\n`);
  writeBuf('0000000000 65535 f \r\n');
  for (let i = 1; i <= objects.length; i++) {
    const offStr = String(xrefOffsets[i]).padStart(10, '0');
    writeBuf(`${offStr} 00000 n \r\n`);
  }
  writeBuf(`trailer\r\n<< /Size ${objects.length + 1} /Root 1 0 R >>\r\nstartxref\r\n${startxref}\r\n%%EOF\r\n`);
  return Buffer.concat(chunks);
}

async function runPdfTests() {
  console.log('--- Starting PDF Embedded Diagram Extraction Tests ---');

  // ----------------------------------------------------
  // TEST 1: Pure JS PNG Encoder Verification
  // ----------------------------------------------------
  const testPixels = Buffer.alloc(8 * 8 * 3, 200);
  const testPng = encodePng({ width: 8, height: 8, data: testPixels, channels: 3 });
  assert(testPng.slice(0, 8).toString('hex') === '89504e470d0a1a0a', 'PNG header signature must match standard 8-byte PNG format');
  console.log('✓ PASS: Pure JavaScript PNG encoder produces valid PNG buffer');

  // ----------------------------------------------------
  // TEST 2: PDF 1 (CQ 1 with Diagram, CQ 2 without Diagram - No Bleed)
  // ----------------------------------------------------
  // Note: PDF page is 842 pt tall.
  // CQ 1: Header at Y = 750 (topY ~ 92)
  // Image at Y = 620 to 680 (topY ~ 162 to 222)
  // Subquestions at Y = 520 to 580 (topY ~ 262 to 322)
  // CQ 2: Header at Y = 400 (topY ~ 442)
  // CQ 2 Subquestions at Y = 250 to 350
  const pdf1Buf = buildSyntheticPdf({
    textBlocks: [
      { text: 'CQ 1: Physics Experiment Stimulus', x: 50, y: 750 },
      { text: '(ka) What is force?', x: 50, y: 580 },
      { text: '(kha) Explain acceleration.', x: 50, y: 550 },
      { text: '(ga) Calculate velocity from the diagram.', x: 50, y: 520 },
      { text: '(gha) Analyze the motion.', x: 50, y: 490 },
      { text: 'CQ 2: Second Question purely textual', x: 50, y: 400 },
      { text: '(ka) Define inertia.', x: 50, y: 350 },
      { text: '(kha) State Newton first law.', x: 50, y: 320 },
      { text: '(ga) Solve mathematical expression.', x: 50, y: 290 },
      { text: '(gha) Justify the result.', x: 50, y: 260 }
    ],
    images: [
      { name: 'ImCQ1', x: 50, y: 610, width: 120, height: 80, rawRgb: Buffer.alloc(10 * 10 * 3, 100), imgW: 10, imgH: 10 }
    ]
  });

  const res1 = await parsePdfQuestionsWithDiagrams(pdf1Buf, { fileName: 'test_cq1_diagram.pdf' });
  assert.strictEqual(res1.questions.length, 2, 'Must detect exactly 2 CQs');
  const cq1 = res1.questions[0];
  const cq2 = res1.questions[1];

  assert.strictEqual(cq1.diagramUrls.length, 1, 'CQ 1 must have exactly 1 diagram');
  assert.strictEqual(cq1.requiresDiagramReview, false, 'CQ 1 diagram must have high confidence (no review flag)');
  assert.strictEqual(cq2.diagramUrls.length, 0, 'CQ 2 must have 0 diagrams (NO bleed from CQ 1)');
  console.log('✓ PASS: PDF 1 — CQ 1 possesses diagram, CQ 2 has no diagram and NO image bleed occurred');

  // ----------------------------------------------------
  // TEST 3: PDF 2 (CQ with Two Embedded Diagrams - Preserves Order)
  // ----------------------------------------------------
  // Two diagrams inside CQ 1 stimulus: Diagram A above Diagram B
  const pdf2Buf = buildSyntheticPdf({
    textBlocks: [
      { text: 'CQ 1: Chemistry Cell Circuit', x: 50, y: 750 },
      { text: '(ka) Define anode.', x: 50, y: 450 },
      { text: '(kha) Explain electrolyte function.', x: 50, y: 420 },
      { text: '(ga) Describe circuit A.', x: 50, y: 390 },
      { text: '(gha) Compare circuit A and B.', x: 50, y: 360 }
    ],
    images: [
      // Diagram A higher up (Y = 660, topY ~ 122)
      { name: 'ImCellA', x: 50, y: 650, width: 100, height: 60, rawRgb: Buffer.alloc(10 * 10 * 3, 50), imgW: 10, imgH: 10 },
      // Diagram B lower down (Y = 530, topY ~ 252)
      { name: 'ImCellB', x: 50, y: 520, width: 100, height: 60, rawRgb: Buffer.alloc(10 * 10 * 3, 80), imgW: 10, imgH: 10 }
    ]
  });

  const res2 = await parsePdfQuestionsWithDiagrams(pdf2Buf, { fileName: 'test_two_diagrams.pdf' });
  assert.strictEqual(res2.questions.length, 1, 'Must detect 1 CQ in PDF 2');
  const cqMulti = res2.questions[0];
  assert.strictEqual(cqMulti.diagramUrls.length, 2, 'CQ must capture both diagrams');
  assert.strictEqual(cqMulti.diagramProvenance[0].imageIndex, 1, 'First diagram index must be 1');
  assert.strictEqual(cqMulti.diagramProvenance[1].imageIndex, 2, 'Second diagram index must be 2');
  assert(cqMulti.diagramProvenance[0].boundingBox.y < cqMulti.diagramProvenance[1].boundingBox.y, 'First diagram must be above second diagram');
  console.log('✓ PASS: PDF 2 — Multiple embedded diagrams correctly extracted and order preserved');

  // ----------------------------------------------------
  // TEST 4: PDF 3 (Ambiguous Image Layout - Flagged For Review)
  // ----------------------------------------------------
  // Image positioned right at the boundary between CQ 1 and CQ 2
  // CQ 1 bottom is at Y = 500. CQ 2 header is at Y = 490.
  // Image sits at Y = 480 to 520 (crosses boundary / distance < 20pt)
  const pdf3Buf = buildSyntheticPdf({
    textBlocks: [
      { text: 'CQ 1: First Question', x: 50, y: 750 },
      { text: '(ka) First sub', x: 50, y: 650 },
      { text: '(kha) Second sub', x: 50, y: 600 },
      { text: 'CQ 2: Second Question Boundary', x: 50, y: 480 },
      { text: '(ka) Sub question', x: 50, y: 350 },
      { text: '(kha) Second sub question', x: 50, y: 300 }
    ],
    images: [
      // Sits right between CQ 1 and CQ 2
      { name: 'ImAmbiguous', x: 50, y: 470, width: 80, height: 50, rawRgb: Buffer.alloc(10 * 10 * 3, 120), imgW: 10, imgH: 10 }
    ]
  });

  const res3 = await parsePdfQuestionsWithDiagrams(pdf3Buf, { fileName: 'test_ambiguous.pdf' });
  const flagged = res3.questions.some(q => q.requiresDiagramReview === true);
  assert(flagged, 'Ambiguously positioned diagram must be flagged requiresDiagramReview = true');
  const reviewQuestion = res3.questions.find(q => q.requiresDiagramReview);
  assert(reviewQuestion.diagramProvenance.length > 0, 'Must include provenance record');
  assert(reviewQuestion.diagramProvenance[0].confidence < 0.6, 'Confidence must be lowered for ambiguous placement');
  assert(reviewQuestion.diagramProvenance[0].reason.includes('সীমারেখা'), 'Provenance reason must detail the boundary ambiguity');
  console.log('✓ PASS: PDF 3 — Ambiguously placed diagram flagged requiresDiagramReview with provenance');

  console.log('--- All PDF Embedded Diagram Extraction Tests PASSED! ---');
}

if (require.main === module) {
  runPdfTests().catch(err => {
    console.error('PDF Test Failure:', err);
    process.exit(1);
  });
}

module.exports = { runPdfTests };
