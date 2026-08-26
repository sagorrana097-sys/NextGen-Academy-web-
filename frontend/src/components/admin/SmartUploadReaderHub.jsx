import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Image as ImageIcon,
  Camera,
  Upload,
  FolderOpen,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Layers,
  Database,
  Search,
  Check,
  X,
  FileText,
  FileSpreadsheet,
  Zap,
  Tag,
  Calendar,
  GraduationCap,
  ListOrdered,
  HelpCircle,
  Eye,
  RefreshCw,
  Edit3,
  Settings2,
  Filter,
  CheckSquare,
  BookMarked
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, curriculumAPI } from '../../services/api';

// =========================================================================
// Exhaustive Default Metadata Master Lists
// =========================================================================
const DEFAULT_CLASSES = [
  'ষষ্ঠ শ্রেণি (Class 6)',
  'সপ্তম শ্রেণি (Class 7)',
  'অষ্টম শ্রেণি (Class 8)',
  'নবম শ্রেণি (Class 9)',
  'দশম শ্রেণি (Class 10)',
  'একাদশ শ্রেণি (Class 11)',
  'দ্বাদশ শ্রেণি (Class 12)',
  'Class 9-10 (SSC)',
  'Class 11-12 (HSC)'
];

const DEFAULT_SUBJECTS = [
  'সাধারণ গণিত (General Math)',
  'উচ্চতর গণিত (Higher Math)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
  'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
  'সাধারণ বিজ্ঞান (General Science)',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা',
  'বাংলা ১ম পত্র (সাহিত্য)',
  'বাংলা ২য় পত্র (বাংলা ব্যাকরণ ও নির্মিতি)',
  'ইংরেজি ১ম পত্র (English 1st Paper)',
  'ইংরেজি ২য় পত্র (English 2nd Paper - Grammar)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)',
  'অর্থনীতি (Economics)',
  'পৌরনীতি ও সুশাসন (Civics)',
  'ইতিহাস (History)',
  'ভূগোল ও পরিবেশ (Geography)'
];

const DEFAULT_GRAMMAR_TOPICS = [
  'বাংলা ব্যাকরণ: ধ্বনিতত্ত্ব ও ধ্বনি পরিবর্তন',
  'বাংলা ব্যাকরণ: রূপতত্ত্ব ও শব্দ গঠন',
  'বাংলা ব্যাকরণ: বাক্যতত্ত্ব ও পদক্রম',
  'বাংলা ব্যাকরণ: সমাস (দ্বন্দ্ব, দ্বিগু, তৎপুরুষ, কর্মধারয়, বহুব্রীহি)',
  'বাংলা ব্যাকরণ: কারক ও বিভক্তি',
  'বাংলা ব্যাকরণ: প্রবাদ ও প্রবচন',
  'বাংলা ব্যাকরণ: বানান শুদ্ধি ও ণ-ত্ব ষ-ত্ব বিধান',
  'বাংলা ব্যাকরণ: সন্ধি (স্বরসন্ধি, ব্যঞ্জনসন্ধি ও বিসর্গ সন্ধি)',
  'বাংলা ব্যাকরণ: উপসর্গ ও অনুসর্গ',
  'বাংলা ব্যাকরণ: প্রত্যয় (কৃৎ প্রত্যয় ও তদ্ধিত প্রত্যয়)',
  'বাংলা ব্যাকরণ: পারিভাষিক শব্দ ও অনুবাদ',
  'English Grammar: Tense & Time Frame',
  'English Grammar: Parts of Speech & Identifications',
  'English Grammar: Voice Change (Active & Passive)',
  'English Grammar: Narration (Direct & Indirect)',
  'English Grammar: Prepositions & Appropriate Prepositions',
  'English Grammar: Right Forms of Verbs',
  'English Grammar: Subject-Verb Agreement',
  'English Grammar: Transformation of Sentences (Simple, Complex, Compound)',
  'English Grammar: Modifiers & Determiners',
  'English Grammar: Completing Sentences & Conditionals',
  'English Grammar: Tag Questions & Connectors / Linkers',
  'English Grammar: Punctuation & Capitalization',
  'English Grammar: Synonym & Antonym (Vocabulary)'
];

const DEFAULT_BOARDS = [
  'ঢাকা বোর্ড (Dhaka Board)',
  'রাজশাহী বোর্ড (Rajshahi Board)',
  'কুমিল্লা বোর্ড (Cumilla Board)',
  'যশোর বোর্ড (Jashore Board)',
  'চট্টগ্রাম বোর্ড (Chattogram Board)',
  'বরিশাল বোর্ড (Barishal Board)',
  'সিলেট বোর্ড (Sylhet Board)',
  'দিনাজপুর বোর্ড (Dinajpur Board)',
  'ময়মনসিংহ বোর্ড (Mymensingh Board)',
  'মাদ্রাসা শিক্ষা বোর্ড (Madrasah Board)',
  'কারিগরি শিক্ষা বোর্ড (Technical Board)'
];

const DEFAULT_INSTITUTIONS = [
  'নটর ডেম কলেজ (Notre Dame College)',
  'রাজউক উত্তরা মডেল কলেজ (RAJUK Uttara Model College)',
  'ঢাকা রেসিডেনসিয়াল মডেল কলেজ (DRMC)',
  'ভিকারুননিসা নূন স্কুল ও কলেজ (Viqarunnisa Noon)',
  'আইডিয়াল স্কুল ও কলেজ, মতিঝিল',
  'মির্জাপুর ক্যাডেট কলেজ (Mirzapur Cadet College)',
  'কুমিল্লা ক্যাডেট কলেজ (Cumilla Cadet College)',
  'ফৌজি ক্যাডেট কলেজ (Faujdarhat Cadet College)',
  'ঝিনাইদহ ক্যাডেট কলেজ (Jhenaidah Cadet College)',
  'চট্টগ্রাম কলেজিয়েট স্কুল (Chattogram Collegiate)',
  'মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়',
  'গাজীপুর ক্যান্টনমেন্ট বোর্ড স্কুল ও কলেজ',
  'রানী বিলাসমণি সরকারি বালক উচ্চ বিদ্যালয়, গাজীপুর',
  'ভাওয়াল বদরে আলম সরকারি কলেজ, গাজীপুর'
];

const DEFAULT_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

const STORAGE_KEY_TAGS = 'nextgen_custom_smartupload_tags';

// =========================================================================
// Advanced Document Text Decoders & UTF-8 Normalizers
// =========================================================================
function cleanExtractedText(text) {
  if (!text) return '';
  return text
    // Replace XML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Remove BOM and binary control characters (preserve \n, \r, \t, Bengali, English, punctuation)
    .replace(/[\uFEFF\uFFFE]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive empty lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parses WordprocessingML XML string into clean Bengali/English text with paragraph breaks
 */
function parseDocxXmlToText(xmlString) {
  if (!xmlString) return '';
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Find all paragraph elements: w:p
    const pElements = xmlDoc.getElementsByTagName('w:p');
    const paragraphList = pElements.length > 0 ? pElements : xmlDoc.getElementsByTagName('p');
    
    if (paragraphList && paragraphList.length > 0) {
      const extractedLines = [];
      
      for (let i = 0; i < paragraphList.length; i++) {
        const p = paragraphList[i];
        let pText = '';
        
        // Find text nodes, tabs, and line breaks in document order
        const textElements = p.querySelectorAll('w\\:t, t, w\\:tab, tab, w\\:br, br, w\\:cr, cr');
        if (textElements && textElements.length > 0) {
          textElements.forEach(node => {
            const tag = (node.localName || node.nodeName || '').toLowerCase().replace(/^w:/, '');
            if (tag === 't') {
              pText += node.textContent || '';
            } else if (tag === 'tab') {
              pText += '\t';
            } else if (tag === 'br' || tag === 'cr') {
              pText += '\n';
            }
          });
        } else {
          pText = p.textContent || '';
        }
        
        const cleaned = cleanExtractedText(pText);
        if (cleaned) {
          extractedLines.push(cleaned);
        }
      }
      
      if (extractedLines.length > 0) {
        return extractedLines.join('\n');
      }
    }
  } catch (domErr) {
    console.warn('DOMParser failed, utilizing XML regex fallback:', domErr);
  }

  // Robust regex parser fallback
  let text = xmlString;
  text = text.replace(/<w:p[^>]*>/gi, '\n');
  text = text.replace(/<\/w:p>/gi, '\n');
  text = text.replace(/<w:tab\s*\/?>/gi, '\t');
  text = text.replace(/<w:br\s*\/?>/gi, '\n');
  text = text.replace(/<w:cr\s*\/?>/gi, '\n');
  text = text.replace(/<w:t[^>]*>(.*?)<\/w:t>/gi, '$1');
  text = text.replace(/<[^>]+>/g, '');
  return cleanExtractedText(text);
}

/**
 * Pure JavaScript ZIP archive unpacker using native Web Stream DecompressionStream
 */
async function unzipDocxEntries(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const entries = {};

  if (bytes.length < 30 || bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    return entries;
  }

  async function decompressChunk(compressedBytes, compMethod) {
    if (compMethod === 0) {
      return new TextDecoder('utf-8').decode(compressedBytes);
    }
    if (compMethod === 8 && typeof DecompressionStream !== 'undefined') {
      try {
        const ds = new DecompressionStream('deflate-raw');
        const stream = new Blob([compressedBytes]).stream().pipeThrough(ds);
        const res = new Response(stream);
        const buf = await res.arrayBuffer();
        return new TextDecoder('utf-8').decode(buf);
      } catch (e1) {
        try {
          const ds2 = new DecompressionStream('deflate');
          const stream2 = new Blob([compressedBytes]).stream().pipeThrough(ds2);
          const res2 = new Response(stream2);
          const buf2 = await res2.arrayBuffer();
          return new TextDecoder('utf-8').decode(buf2);
        } catch (e2) {}
      }
    }
    return null;
  }

  // Search for End of Central Directory (EOCD)
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset !== -1) {
    const cdCount = view.getUint16(eocdOffset + 10, true);
    const cdOffset = view.getUint32(eocdOffset + 16, true);
    let currCdOffset = cdOffset;

    for (let c = 0; c < cdCount && currCdOffset < eocdOffset; c++) {
      if (
        bytes[currCdOffset] !== 0x50 ||
        bytes[currCdOffset + 1] !== 0x4b ||
        bytes[currCdOffset + 2] !== 0x01 ||
        bytes[currCdOffset + 3] !== 0x02
      ) {
        break;
      }
      const compMethod = view.getUint16(currCdOffset + 10, true);
      const compSize = view.getUint32(currCdOffset + 20, true);
      const fnLen = view.getUint16(currCdOffset + 28, true);
      const extraLen = view.getUint16(currCdOffset + 30, true);
      const commentLen = view.getUint16(currCdOffset + 32, true);
      const localHeaderOffset = view.getUint32(currCdOffset + 42, true);

      const fnBytes = bytes.subarray(currCdOffset + 46, currCdOffset + 46 + fnLen);
      const filename = new TextDecoder('utf-8').decode(fnBytes);

      if (
        localHeaderOffset + 30 <= bytes.length &&
        bytes[localHeaderOffset] === 0x50 &&
        bytes[localHeaderOffset + 1] === 0x4b &&
        bytes[localHeaderOffset + 2] === 0x03 &&
        bytes[localHeaderOffset + 3] === 0x04
      ) {
        const localFnLen = view.getUint16(localHeaderOffset + 26, true);
        const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
        const dataStart = localHeaderOffset + 30 + localFnLen + localExtraLen;
        const dataEnd = dataStart + compSize;
        if (dataEnd <= bytes.length) {
          const compData = bytes.subarray(dataStart, dataEnd);
          const decompressedText = await decompressChunk(compData, compMethod);
          if (decompressedText) {
            entries[filename] = decompressedText;
          }
        }
      }

      currCdOffset += 46 + fnLen + extraLen + commentLen;
    }
  }

  // Direct local header scan fallback
  if (Object.keys(entries).length === 0) {
    let offset = 0;
    while (offset < bytes.length - 30) {
      if (
        bytes[offset] === 0x50 &&
        bytes[offset + 1] === 0x4b &&
        bytes[offset + 2] === 0x03 &&
        bytes[offset + 3] === 0x04
      ) {
        const compMethod = view.getUint16(offset + 8, true);
        let compSize = view.getUint32(offset + 18, true);
        const fnLen = view.getUint16(offset + 26, true);
        const extraLen = view.getUint16(offset + 28, true);
        const fnBytes = bytes.subarray(offset + 30, offset + 30 + fnLen);
        const filename = new TextDecoder('utf-8').decode(fnBytes);
        const dataStart = offset + 30 + fnLen + extraLen;

        if (compSize === 0) {
          let nextHeader = bytes.length;
          for (let k = dataStart; k < bytes.length - 4; k++) {
            if (bytes[k] === 0x50 && bytes[k + 1] === 0x4b && (bytes[k + 2] === 0x03 || bytes[k + 2] === 0x01 || bytes[k + 2] === 0x05)) {
              nextHeader = k;
              break;
            }
          }
          compSize = nextHeader - dataStart;
        }

        const dataEnd = dataStart + compSize;
        if (dataEnd <= bytes.length) {
          const compData = bytes.subarray(dataStart, dataEnd);
          const decompressedText = await decompressChunk(compData, compMethod);
          if (decompressedText) {
            entries[filename] = decompressedText;
          }
        }
        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }
  }

  return entries;
}

/**
 * Extracts pure Bengali & English text from modern .docx files
 */
async function extractTextFromDocxBuffer(arrayBuffer) {
  try {
    const entries = await unzipDocxEntries(arrayBuffer);
    
    let mainDocXml = entries['word/document.xml'] || entries['word/document2.xml'];
    let combinedXml = mainDocXml || '';

    // Also include headers/footers or footnotes if any
    for (const [filename, content] of Object.entries(entries)) {
      if (filename.startsWith('word/') && filename.endsWith('.xml') && filename !== 'word/document.xml' && filename !== 'word/document2.xml') {
        if (!mainDocXml) {
          combinedXml += '\n' + content;
        }
      }
    }

    if (combinedXml) {
      const parsed = parseDocxXmlToText(combinedXml);
      if (parsed && parsed.trim().length > 0) {
        return parsed;
      }
    }

    // Fallback: uncompressed XML fragment scan
    const decoder = new TextDecoder('utf-8');
    const rawString = decoder.decode(new Uint8Array(arrayBuffer));
    if (rawString.includes('<w:p') || rawString.includes('<w:t')) {
      const parsed = parseDocxXmlToText(rawString);
      if (parsed && parsed.trim().length > 0) {
        return parsed;
      }
    }

    // Safe Bengali and English word tokens
    const textFragments = rawString.match(/[a-zA-Z0-9\u0980-\u09FF\s.,?!:;()\-–—'"/+=%]{4,}/g) || [];
    return cleanExtractedText(textFragments.join(' '));
  } catch (err) {
    console.warn('DOCX extraction error:', err);
    const decoder = new TextDecoder('utf-8');
    return cleanExtractedText(decoder.decode(arrayBuffer));
  }
}

/**
 * Extracts readable text from legacy .doc binary files or safely signals conversion need
 */
function extractTextFromDocBuffer(arrayBuffer) {
  try {
    const uint8 = new Uint8Array(arrayBuffer);

    // 1. Check if it is actually a renamed .docx file
    if (uint8.length >= 4 && uint8[0] === 0x50 && uint8[1] === 0x4b && uint8[2] === 0x03 && uint8[3] === 0x04) {
      return { isDocx: true };
    }

    // 2. Extract UTF-16LE characters (common in Microsoft Word binary .doc)
    const utf16Chars = [];
    for (let i = 0; i < uint8.length - 1; i += 2) {
      const code = uint8[i] | (uint8[i + 1] << 8);
      // Bengali (\u0980-\u09FF), Printable ASCII (0x20-0x7E), or Newline/Tab
      if ((code >= 0x0980 && code <= 0x09FF) || (code >= 0x20 && code <= 0x7E) || code === 0x0A || code === 0x0D || code === 0x09) {
        utf16Chars.push(String.fromCharCode(code));
      }
    }
    const utf16Text = utf16Chars.join('');
    const cleanUtf16 = cleanExtractedText(utf16Text);

    // Test if meaningful Bengali question content was recovered
    const hasBengali = /[\u0980-\u09FF]/.test(cleanUtf16);
    const hasStructure = cleanUtf16.length > 50 && (
      cleanUtf16.includes('উদ্দীপক') ||
      cleanUtf16.includes('ক)') ||
      cleanUtf16.includes('খ)') ||
      cleanUtf16.includes('১.') ||
      cleanUtf16.includes('উত্তর') ||
      cleanUtf16.includes('ক.') ||
      cleanUtf16.includes('MCQ') ||
      cleanUtf16.includes('CQ')
    );

    if (hasBengali && hasStructure) {
      return { success: true, text: cleanUtf16 };
    }

    // 3. Extract UTF-8 character sequences
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const rawString = utf8Decoder.decode(uint8);
    const fragments = rawString.match(/[\u0980-\u09FFa-zA-Z0-9\s.,?!:;()\-–—'"/+=%]{6,}/g) || [];
    const joined = cleanExtractedText(fragments.join(' '));

    if (joined && joined.length > 60 && /[\u0980-\u09FF]/.test(joined)) {
      return { success: true, text: joined };
    }

    return { success: false, reason: 'legacy_doc' };
  } catch (err) {
    return { success: false, reason: 'parse_error', error: err.message };
  }
}

/**
 * Helper to decode PDF Hexadecimal strings <...> (supports UTF-16BE and ASCII)
 */
function decodePdfHexString(hex) {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  if (!cleanHex) return '';

  // Check UTF-16BE (2 bytes / 4 hex chars per char)
  if (cleanHex.length % 4 === 0) {
    let utf16Str = '';
    for (let i = 0; i < cleanHex.length; i += 4) {
      const code = parseInt(cleanHex.substring(i, i + 4), 16);
      if (!isNaN(code) && code > 0) {
        utf16Str += String.fromCharCode(code);
      }
    }
    if (/[\u0980-\u09FFa-zA-Z0-9]/.test(utf16Str)) {
      return utf16Str;
    }
  }

  // Fallback 1 byte per char
  let byteStr = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const code = parseInt(cleanHex.substring(i, i + 2), 16);
    if (!isNaN(code) && code > 0) {
      byteStr += String.fromCharCode(code);
    }
  }
  return byteStr;
}

/**
 * Helper to decode PDF literal string escapes: \n, \r, \t, \ddd (octal)
 */
function decodePdfLiteralString(str) {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

/**
 * Extract text from PDF content stream (uncompressed or inflated)
 */
function parsePdfContentStream(text) {
  const lines = [];

  // Match all Tj (single string)
  const tjRegex = /(?:\(([\s\S]*?)\)|<([0-9a-fA-F\s]+)>)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(text)) !== null) {
    if (match[1] !== undefined) {
      lines.push(decodePdfLiteralString(match[1]));
    } else if (match[2] !== undefined) {
      lines.push(decodePdfHexString(match[2]));
    }
  }

  // Match all TJ (array of strings and kerning offsets)
  const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(text)) !== null) {
    const inner = match[1];
    let chunk = '';
    const tokenRegex = /(?:\(([\s\S]*?)\)|<([0-9a-fA-F\s]+)>)/g;
    let tokenMatch;
    while ((tokenMatch = tokenRegex.exec(inner)) !== null) {
      if (tokenMatch[1] !== undefined) {
        chunk += decodePdfLiteralString(tokenMatch[1]);
      } else if (tokenMatch[2] !== undefined) {
        chunk += decodePdfHexString(tokenMatch[2]);
      }
    }
    if (chunk) lines.push(chunk);
  }

  // Match single quote ' (move to next line and show text)
  const quoteRegex = /(?:\(([\s\S]*?)\)|<([0-9a-fA-F\s]+)>)\s*'/g;
  while ((match = quoteRegex.exec(text)) !== null) {
    if (match[1] !== undefined) {
      lines.push('\n' + decodePdfLiteralString(match[1]));
    } else if (match[2] !== undefined) {
      lines.push('\n' + decodePdfHexString(match[2]));
    }
  }

  return lines;
}

/**
 * Robust async PDF text extraction supporting Flate streams and native decompression
 */
async function extractTextFromPdfBuffer(arrayBuffer) {
  try {
    const uint8 = new Uint8Array(arrayBuffer);
    const latinDecoder = new TextDecoder('latin1');
    const rawPdf = latinDecoder.decode(uint8);

    const allLines = [];

    // 1. Parse direct uncompressed text in PDF
    const directLines = parsePdfContentStream(rawPdf);
    allLines.push(...directLines);

    // 2. Scan and decompress all stream objects
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch;

    while ((streamMatch = streamRegex.exec(rawPdf)) !== null) {
      const streamStart = streamMatch.index + streamMatch[0].indexOf('\n') + 1;
      const streamEnd = streamMatch.index + streamMatch[0].lastIndexOf('endstream');
      if (streamEnd > streamStart) {
        const streamBytes = uint8.slice(streamStart, streamEnd);

        // Try DecompressionStream deflate / deflate-raw
        if (typeof DecompressionStream !== 'undefined') {
          for (const format of ['deflate', 'deflate-raw']) {
            try {
              const ds = new DecompressionStream(format);
              const writer = ds.writable.getWriter();
              writer.write(streamBytes);
              writer.close();
              const response = new Response(ds.readable);
              const decompressed = await response.text();

              if (decompressed && (decompressed.includes('BT') || decompressed.includes('Tj') || decompressed.includes('TJ'))) {
                const streamLines = parsePdfContentStream(decompressed);
                if (streamLines.length > 0) {
                  allLines.push(...streamLines);
                }
              }
              break;
            } catch (e) {
              // Try next format
            }
          }
        }
      }
    }

    // 3. Fallback to direct UTF-8 & Bengali regex scanner
    if (allLines.length === 0) {
      const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
      const utf8Text = utf8Decoder.decode(uint8);
      const bengaliChunks = utf8Text.match(/[\u0980-\u09FFa-zA-Z0-9\s.,?!:;()\-–—'"/+=%]{4,}/g) || [];
      if (bengaliChunks.length > 0) {
        allLines.push(bengaliChunks.join(' '));
      }
    }

    const joinedText = allLines.join('\n');
    const cleaned = cleanExtractedText(joinedText);

    if (cleaned && cleaned.trim().length > 20) {
      return { success: true, text: cleaned };
    }

    return {
      success: false,
      reason: 'scanned_or_encrypted',
      text: cleaned
    };
  } catch (err) {
    console.warn('PDF extraction error:', err);
    try {
      const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
      const fallbackText = cleanExtractedText(utf8Decoder.decode(arrayBuffer));
      if (fallbackText && fallbackText.trim().length > 20) {
        return { success: true, text: fallbackText };
      }
    } catch (e) {}
    return { success: false, reason: 'parse_error', error: err.message };
  }
}


export default function SmartUploadReaderHub({ onNavigateToMaker, onNavigateToOMR }) {
  const { lang, t } = useLanguage();

  // Dynamic & Custom Tags State
  const [customTags, setCustomTags] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      classes: DEFAULT_CLASSES,
      subjects: DEFAULT_SUBJECTS,
      grammarTopics: DEFAULT_GRAMMAR_TOPICS,
      boards: DEFAULT_BOARDS,
      institutions: DEFAULT_INSTITUTIONS
    };
  });

  // Save tags persistently
  const saveCustomTags = (newTags) => {
    setCustomTags(newTags);
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(newTags));
    } catch (e) {}
  };

  // Ingestion Form State
  const [targetClass, setTargetClass] = useState('দশম শ্রেণি (Class 10)');
  const [targetBook, setTargetBook] = useState('পদার্থবিজ্ঞান (Physics)');
  const [targetInstitution, setTargetInstitution] = useState('ঢাকা বোর্ড (Dhaka Board)');
  const [targetYear, setTargetYear] = useState('2025');
  const [hasChapter, setHasChapter] = useState(true);
  const [targetChapter, setTargetChapter] = useState('অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি');

  // Tag Search / Filter in Form
  const [subjectSearch, setSubjectSearch] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState('core'); // 'core' | 'grammar'

  // Dynamic Tag Manager Modal State
  const [tagModalConfig, setTagModalConfig] = useState({
    isOpen: false,
    categoryKey: 'subjects', // 'classes' | 'subjects' | 'grammarTopics' | 'boards' | 'institutions'
    title: 'বিষয় ও বই ট্যাগ ম্যানেজ করুন'
  });
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTagIdx, setEditingTagIdx] = useState(null);
  const [editingTagText, setEditingTagText] = useState('');

  // Input Data
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Repository Stored Questions
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRepoQuestions();
  }, []);

  const fetchRepoQuestions = async () => {
    setLoadingRepo(true);
    try {
      const res = await questionRepositoryAPI.getQuestions();
      if (res.success && Array.isArray(res.data)) {
        setRepoQuestions(res.data);
      }
    } catch (err) {
      console.warn('Failed to load repository questions:', err);
    } finally {
      setLoadingRepo(false);
    }
  };

  // Open Tag Manager Modal
  const handleOpenTagManager = (categoryKey, title) => {
    setTagModalConfig({
      isOpen: true,
      categoryKey,
      title
    });
    setNewTagInput('');
    setEditingTagIdx(null);
  };

  // Add new tag to category
  const handleAddTag = () => {
    const val = newTagInput.trim();
    if (!val) return;
    const cat = tagModalConfig.categoryKey;
    const currentList = customTags[cat] || [];
    if (currentList.includes(val)) {
      alert('এই ট্যাগটি ইতোমধ্যে তালিকায় উপস্থিত রয়েছে!');
      return;
    }
    const updated = [val, ...currentList];
    const newCustomTags = { ...customTags, [cat]: updated };
    saveCustomTags(newCustomTags);
    setNewTagInput('');

    // Auto-select the newly added tag in the active form
    if (cat === 'classes') setTargetClass(val);
    if (cat === 'subjects' || cat === 'grammarTopics') setTargetBook(val);
    if (cat === 'boards' || cat === 'institutions') setTargetInstitution(val);
  };

  // Save edited tag
  const handleSaveEditTag = (index) => {
    const val = editingTagText.trim();
    if (!val) return;
    const cat = tagModalConfig.categoryKey;
    const currentList = [...(customTags[cat] || [])];
    currentList[index] = val;
    const newCustomTags = { ...customTags, [cat]: currentList };
    saveCustomTags(newCustomTags);
    setEditingTagIdx(null);
    setEditingTagText('');
  };

  // Delete tag
  const handleDeleteTag = (index) => {
    const cat = tagModalConfig.categoryKey;
    const currentList = (customTags[cat] || []).filter((_, i) => i !== index);
    const newCustomTags = { ...customTags, [cat]: currentList };
    saveCustomTags(newCustomTags);
  };

  // Reset category to defaults
  const handleResetCategoryTags = () => {
    const cat = tagModalConfig.categoryKey;
    let def = [];
    if (cat === 'classes') def = DEFAULT_CLASSES;
    if (cat === 'subjects') def = DEFAULT_SUBJECTS;
    if (cat === 'grammarTopics') def = DEFAULT_GRAMMAR_TOPICS;
    if (cat === 'boards') def = DEFAULT_BOARDS;
    if (cat === 'institutions') def = DEFAULT_INSTITUTIONS;

    const newCustomTags = { ...customTags, [cat]: def };
    saveCustomTags(newCustomTags);
  };

  // Active Tab for Parsed Staging Questions ('ALL' | 'MCQ' | 'CQ' | 'SQ')
  const [parsedActiveTab, setParsedActiveTab] = useState('ALL');

  // Strict Categorization Parser Engine
  const handleParseRawText = (textToParse = rawText) => {
    if (!textToParse || !textToParse.trim()) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে প্রশ্নপত্র পেস্ট করুন অথবা ফাইল আপলোড করুন।' });
      return;
    }

    setIsParsing(true);
    setFeedbackMsg(null);

    try {
      const clean = textToParse.trim();

      // Check if JSON
      if (clean.startsWith('[') || clean.startsWith('{')) {
        try {
          const parsed = JSON.parse(clean);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          setParsedQuestions(list);
          setFeedbackMsg({ type: 'success', text: 'সফলভাবে ' + list.length + 'টি প্রশ্ন পার্স করা হয়েছে!' });
          setIsParsing(false);
          return;
        } catch (e) {}
      }

            // Text block parser
      const blocks = clean.split(/\r?\n\s*\r?\n+/).map(b => b.trim()).filter(Boolean);
      const results = [];

      blocks.forEach((block, idx) => {
        const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        // Check for diagram/image
        let diagramUrl = null;
        let diagramCaption = null;
        const imgMatch = block.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          diagramCaption = imgMatch[1] || 'চিত্র';
          diagramUrl = imgMatch[2];
        } else if (block.includes('চিত্র') || block.includes('লেখচিত্র') || block.includes('বর্তনী') || block.includes('Graph') || block.includes('Diagram')) {
          diagramCaption = 'উদ্দীপকের সংশ্লিষ্ট চিত্র / বর্তনী / লেখচিত্র';
        }

        // 1. Creative Question (CQ) Pattern Detection
        const hasCQMarker = block.includes('উদ্দীপক') || block.includes('অনুচ্ছেদ') || block.includes('দৃশ্যকল্প');
        const hasSubA = lines.some(l => /^[(\[]?(?:ক|a)[)\]\.\s]/i.test(l));
        const hasSubB = lines.some(l => /^[(\[]?(?:খ|b)[)\]\.\s]/i.test(l));

        if (hasCQMarker || (hasSubA && hasSubB)) {
          const stemLines = [];
          const subQs = {
            a: { q: '', marks: 1 },
            b: { q: '', marks: 2 },
            c: { q: '', marks: 3 },
            d: { q: '', marks: 4 }
          };

          lines.forEach(line => {
            const cleanLine = line.replace(/!\[.*?\]\(.*?\)/g, '').trim();
            if (/^[(\[]?(?:ক|a)[)\]\.\s]/i.test(cleanLine)) {
              subQs.a.q = cleanLine.replace(/^[(\[]?(?:ক|a)[)\]\.\s]+/i, '').replace(/\[[0-9১-৯]+\]$/, '').trim();
            } else if (/^[(\[]?(?:খ|b)[)\]\.\s]/i.test(cleanLine)) {
              subQs.b.q = cleanLine.replace(/^[(\[]?(?:খ|b)[)\]\.\s]+/i, '').replace(/\[[0-9১-৯]+\]$/, '').trim();
            } else if (/^[(\[]?(?:গ|c)[)\]\.\s]/i.test(cleanLine)) {
              subQs.c.q = cleanLine.replace(/^[(\[]?(?:গ|c)[)\]\.\s]+/i, '').replace(/\[[0-9১-৯]+\]$/, '').trim();
            } else if (/^[(\[]?(?:ঘ|d)[)\]\.\s]/i.test(cleanLine)) {
              subQs.d.q = cleanLine.replace(/^[(\[]?(?:ঘ|d)[)\]\.\s]+/i, '').replace(/\[[0-9১-৯]+\]$/, '').trim();
            } else {
              stemLines.push(cleanLine);
            }
          });

          results.push({
            id: 'cq-' + Date.now() + '-' + idx,
            type: 'CQ',
            stem: stemLines.join(' ') || 'উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:',
            subQuestions: subQs,
            diagramUrl,
            diagramCaption,
            difficulty: 'MEDIUM',
            boardOrInstitute: targetInstitution,
            year: targetYear,
            subject: targetBook,
            class: targetClass,
            chapter: hasChapter ? targetChapter : null
          });
          return;
        }

        // 2. Multiple Choice Question (MCQ) Pattern Detection
        const optMatches = lines.filter(l => /^[([]?[কখগঘabcd1234][).\]\s]/i.test(l));
        const isMCQ = optMatches.length >= 2 || block.includes('উত্তর:') || block.includes('Ans:');

        if (isMCQ) {
          const qLine = lines[0] || '';
          const options = [];
          let ans = 'ক';
          let explanation = '';

          lines.slice(1).forEach(line => {
            if (/^(?:উত্তর|Ans)[:.]/i.test(line)) {
              const matched = line.match(/(?:উত্তর:|Ans:)\s*([ক-ঘa-dA-D1-4])/i);
              if (matched) ans = matched[1];
            } else if (/^(?:ব্যাখ্যা|Explanation)[:.]/i.test(line)) {
              explanation = line.replace(/^(?:ব্যাখ্যা:|Explanation:)\s*/i, '');
            } else if (/^[([]?[কখগঘabcd1234][).\]\s]/i.test(line)) {
              const cleanedOpt = line.replace(/^[([]?[কখগঘabcd1234][).\]\s]+/i, '').trim();
              if (cleanedOpt) options.push(cleanedOpt);
            }
          });

          while (options.length < 4) {
            options.push('বিকল্প ' + (options.length + 1));
          }

          results.push({
            id: 'mcq-' + Date.now() + '-' + idx,
            type: 'MCQ',
            question: qLine.replace(/^[0-9১-৯]+[.)\]\s]+/, '').replace(/!\[.*?\]\(.*?\)/g, '').trim() || 'বহুনির্বাচনী প্রশ্ন ' + (idx + 1),
            options: options.slice(0, 4),
            correctAnswer: ans,
            explanation,
            diagramUrl,
            diagramCaption,
            difficulty: 'MEDIUM',
            boardOrInstitute: targetInstitution,
            year: targetYear,
            subject: targetBook,
            class: targetClass,
            chapter: hasChapter ? targetChapter : null
          });
          return;
        }

        // 3. Short Question / Knowledge / Comprehension (SQ) Detection
        const sqLine = lines.join(' ').replace(/^[0-9১-৯]+[.)\]\s]+/, '').replace(/!\[.*?\]\(.*?\)/g, '').trim();
        let sqAns = '';
        const ansMatch = sqLine.match(/(?:উত্তর|Ans|উত্তরঃ)[:.]\s*(.*)/i);
        if (ansMatch) {
          sqAns = ansMatch[1].trim();
        }

        results.push({
          id: 'sq-' + Date.now() + '-' + idx,
          type: 'SQ',
          question: sqLine.replace(/(?:উত্তর|Ans|উত্তরঃ)[:.]\s*.*$/i, '').trim() || 'সংক্ষিপ্ত প্রশ্ন ' + (idx + 1),
          shortAnswer: sqAns,
          diagramUrl,
          diagramCaption,
          marks: 2,
          difficulty: 'MEDIUM',
          boardOrInstitute: targetInstitution,
          year: targetYear,
          subject: targetBook,
          class: targetClass,
          chapter: hasChapter ? targetChapter : null
        });
      });

      if (results.length > 0) {
        setParsedQuestions(results);
        const mcqCount = results.filter(q => q.type === 'MCQ').length;
        const cqCount = results.filter(q => q.type === 'CQ').length;
        const sqCount = results.filter(q => q.type === 'SQ').length;
        setFeedbackMsg({
          type: 'success',
          text: `🎉 মোট ${results.length}টি প্রশ্ন অটো-ক্যাটাগরি হয়েছে! (MCQ: ${mcqCount}, CQ: ${cqCount}, SQ: ${sqCount})`
        });
      } else {
        setFeedbackMsg({ type: 'error', text: 'কোনো প্রশ্ন সনাক্ত করা যায়নি। সঠিক ফরম্যাটে টেক্সট পেস্ট করুন।' });
      }
      setIsParsing(false);
      return;
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'পার্সিংয়ে ত্রুটি: ' + err.message });
    } finally {
      setIsParsing(false);
    }
  };

  // Handle Multi-Format File Upload with Clean UTF-8 Extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-uploading triggers properly
    e.target.value = '';

    // Check 100MB size limit
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setFeedbackMsg({
        type: 'error',
        text: `ফাইলের আকার ১০০MB এর চেয়ে বেশি হতে পারবে না (বর্তমান আকার: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`
      });
      return;
    }

    setUploadedFileName(file.name);
    setIsParsing(true);
    setFeedbackMsg(null);

    const fileNameLower = file.name.toLowerCase();

    try {
      if (fileNameLower.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const buffer = event.target?.result;
            const extracted = await extractTextFromDocxBuffer(buffer);
            if (!extracted || !extracted.trim()) {
              setFeedbackMsg({
                type: 'error',
                text: 'Word (.docx) ফাইল থেকে কোনো প্রশ্ন টেক্সট পাওয়া যায়নি। অনুগ্রহ করে ফাইলটি চেক করুন।'
              });
              setIsParsing(false);
              return;
            }
            setRawText(extracted);
            handleParseRawText(extracted);
          } catch (docxErr) {
            setFeedbackMsg({
              type: 'error',
              text: 'Word (.docx) ফাইল পড়তে সমস্যা হয়েছে: ' + docxErr.message
            });
            setIsParsing(false);
          }
        };
        reader.onerror = () => {
          setFeedbackMsg({ type: 'error', text: 'ফাইল লোড করতে ব্যর্থ হয়েছে।' });
          setIsParsing(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (fileNameLower.endsWith('.doc')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const buffer = event.target?.result;
            const docResult = extractTextFromDocBuffer(buffer);

            if (docResult.isDocx) {
              const extracted = await extractTextFromDocxBuffer(buffer);
              if (extracted && extracted.trim()) {
                setRawText(extracted);
                handleParseRawText(extracted);
                return;
              }
            } else if (docResult.success && docResult.text) {
              setRawText(docResult.text);
              handleParseRawText(docResult.text);
              return;
            }

            // Fallback for binary .doc files without readable text
            setFeedbackMsg({
              type: 'error',
              text: '⚠️ এটি একটি পুরোনো বাইনারি .doc ফাইল। ১০০% সঠিক বাংলা ফন্ট ও MCQ/CQ ফরম্যাটের জন্য ফাইলটি Word-এ ওপেন করে .docx অথবা .txt হিসেবে সেভ করে আপলোড করুন।'
            });
            setIsParsing(false);
          } catch (docErr) {
            setFeedbackMsg({
              type: 'error',
              text: 'ফাইলটি পড়তে সমস্যা হয়েছে। অনুগ্রহ করে .docx অথবা .txt ফরম্যাটে রূপান্তর করে আপলোড করুন।'
            });
            setIsParsing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileNameLower.endsWith('.pdf') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const buffer = event.target?.result;
            const pdfResult = await extractTextFromPdfBuffer(buffer);
            const extractedText = typeof pdfResult === 'string' ? pdfResult : (pdfResult?.text || '');

            if (pdfResult?.success && extractedText && extractedText.trim()) {
              setRawText(extractedText);
              handleParseRawText(extractedText);
              setFeedbackMsg({
                type: 'success',
                text: `PDF ফাইল সফলভাবে প্রসেস করা হয়েছে! (${extractedText.length} অক্ষর এক্সট্রাক্ট হয়েছে)`
              });
              return;
            }

            if (extractedText && extractedText.trim().length > 30) {
              setRawText(extractedText);
              handleParseRawText(extractedText);
              return;
            }

            // Scanned / protected PDF notice
            setFeedbackMsg({
              type: 'error',
              text: '⚠️ এই PDF ফাইলটি স্ক্যান করা ছবি অথবা পাসওয়ার্ড প্রটেক্টেড হতে পারে। ১০০% নির্ভুল বাংলা পার্সিংয়ের জন্য প্রশ্নপত্রটি Word (.docx) বা .txt ফরম্যাটে সেভ করে আপলোড করুন অথবা সরাসরি টেক্সট কপি-পেস্ট করুন।'
            });
            setIsParsing(false);
          } catch (pdfErr) {
            setFeedbackMsg({
              type: 'error',
              text: 'PDF ফাইল পড়তে সমস্যা হয়েছে: ' + pdfErr.message
            });
            setIsParsing(false);
          }
        };
        reader.onerror = () => {
          setFeedbackMsg({ type: 'error', text: 'PDF ফাইল লোড করতে ব্যর্থ হয়েছে।' });
          setIsParsing(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        // .txt, .csv, .json, etc.
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result;
            if (typeof content === 'string') {
              const cleaned = cleanExtractedText(content);
              if (!cleaned || !cleaned.trim()) {
                setFeedbackMsg({
                  type: 'error',
                  text: 'টেক্সট ফাইলটি খালি বা কোনো প্রশ্ন পাওয়া যায়নি।'
                });
                setIsParsing(false);
                return;
              }
              setRawText(cleaned);
              handleParseRawText(cleaned);
            }
          } catch (txtErr) {
            setFeedbackMsg({
              type: 'error',
              text: 'টেক্সট ফাইল প্রসেস করতে ব্যর্থ হয়েছে: ' + txtErr.message
            });
            setIsParsing(false);
          }
        };
        reader.readAsText(file, 'utf-8');
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'ফাইল থেকে টেক্সট এক্সট্রাক্ট করতে সমস্যা হয়েছে: ' + err.message });
      setIsParsing(false);
    }
  };

  // Submit to Repository
  const handleSaveToRepository = async () => {
    if (parsedQuestions.length === 0) {
      setFeedbackMsg({ type: 'error', text: 'সংরক্ষণ করার জন্য কোনো পার্সড প্রশ্ন নেই।' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        metadata: {
          className: targetClass,
          book: targetBook,
          institutionOrBoard: targetInstitution,
          year: targetYear,
          chapter: hasChapter ? targetChapter : null,
          badge: '[' + targetInstitution + ' - \'' + targetYear.slice(-2) + ']'
        },
        questions: parsedQuestions
      };

      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: '🎉 অভিনন্দন! ' + (res.data?.count || parsedQuestions.length) + 'টি প্রশ্ন কেন্দ্রীয় রিপোজিটরিতে সংরক্ষিত হয়েছে এবং এআই ট্রেইনিং সম্পন্ন হয়েছে!'
        });
        setParsedQuestions([]);
        setRawText('');
        setUploadedFileName(null);
        fetchRepoQuestions();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error?.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে।' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'নেটওয়ার্ক সমস্যা।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete from repository
  const handleDeleteRepoItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি রিপোজিটরি থেকে মুছে ফেলতে চান?')) return;
    try {
      const res = await questionRepositoryAPI.deleteQuestion(id);
      if (res.success) {
        setRepoQuestions(prev => prev.filter(q => q.id !== id));
      }
    } catch (err) {
      alert('মুছে ফেলতে সমস্যা হয়েছে: ' + err.message);
    }
  };

  const filteredRepo = useMemo(() => {
    return repoQuestions.filter(q => {
      const matchesSearch = !repoSearch || 
        (q.question || q.stem || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
        (q.institutionOrBoard || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
        (q.book || '').toLowerCase().includes(repoSearch.toLowerCase());
      const matchesType = filterType === 'ALL' || q.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [repoQuestions, repoSearch, filterType]);

  
  // Categorized Staging Questions
  const filteredParsedQuestions = useMemo(() => {
    if (parsedActiveTab === 'ALL') return parsedQuestions;
    return parsedQuestions.filter(q => q.type === parsedActiveTab);
  }, [parsedQuestions, parsedActiveTab]);

  const parsedStats = useMemo(() => {
    return {
      all: parsedQuestions.length,
      mcq: parsedQuestions.filter(q => q.type === 'MCQ').length,
      cq: parsedQuestions.filter(q => q.type === 'CQ').length,
      sq: parsedQuestions.filter(q => q.type === 'SQ').length
    };
  }, [parsedQuestions]);

  // Filtered Subject/Grammar Pills for Quick Selection
  const activeSubjectPills = useMemo(() => {
    const list = selectedSubTab === 'core' ? (customTags.subjects || []) : (customTags.grammarTopics || []);
    if (!subjectSearch) return list;
    return list.filter(item => item.toLowerCase().includes(subjectSearch.toLowerCase()));
  }, [customTags, selectedSubTab, subjectSearch]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>পার্ট ১: কেন্দ্রীয় ডকুমেন্ট ও প্রশ্ন ভান্ডার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              স্মার্ট আপলোড ও এআই রিডার হাব (Smart Upload & AI Reader)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              পিডিএফ, ওয়ার্ড, টেক্সট বা বিগত সালের বোর্ড ও শীর্ষ কলেজের প্রশ্নপত্র আপলোড করুন। ৬ষ্ঠ থেকে ১২শ শ্রেণি এবং বাংলা ও ইংলিশ গ্রামারের পূর্ণাঙ্গ বিষয় ভিত্তিক মেটাডেটা ট্যাগিং করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] text-indigo-200 block font-bold">রিপোজিটরিতে মোট প্রশ্ন</span>
              <span className="text-2xl font-black text-white">{repoQuestions.length} টি</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToMaker && (
                <button
                  type="button"
                  onClick={onNavigateToMaker}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>পার্ট ২: প্রশ্ন মেকার →</span>
                </button>
              )}
              {onNavigateToOMR && (
                <button
                  type="button"
                  onClick={onNavigateToOMR}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>পার্ট ৩: OMR মূল্যায়ন →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={'p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in ' + (
          feedbackMsg.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        )}>
          <div className="flex items-center space-x-2">
            {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="font-bold text-slate-500 hover:text-slate-800">✕</button>
        </div>
      )}

      {/* Main Grid: Upload & Tagging Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metadata Tagging Configuration */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>১. মেটাডেটা ও ট্যাগিং কনফিগারেশন</span>
              </h3>
            </div>

            {/* 1. Class Dropdown & Live Manager */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">🎓 শ্রেণি (Class - ৬ষ্ঠ থেকে ১২শ) *</label>
                <button
                  type="button"
                  onClick={() => handleOpenTagManager('classes', 'শ্রেণি তালিকা ম্যানেজ ও এডিট করুন')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>ট্যাগ এডিট ও ম্যানেজ</span>
                </button>
              </div>

              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              >
                {(customTags.classes || DEFAULT_CLASSES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Quick Class Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {(customTags.classes || DEFAULT_CLASSES).slice(0, 7).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTargetClass(c)}
                    className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                      targetClass === c ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {c.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Book / Subject & Grammar Topics Selection */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">📖 বিষয় / বই / গ্রামার টপিক *</label>
                <button
                  type="button"
                  onClick={() => handleOpenTagManager(selectedSubTab === 'core' ? 'subjects' : 'grammarTopics', selectedSubTab === 'core' ? 'মূল বিষয় ও পাঠ্যবই ট্যাগ এডিট' : 'বাংলা ও ইংলিশ গ্রামার টপিক ট্যাগ এডিট')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>ট্যাগ এডিট ও ম্যানেজ</span>
                </button>
              </div>

              {/* Free Text Input Field with Active Value */}
              <input
                type="text"
                value={targetBook}
                onChange={(e) => setTargetBook(e.target.value)}
                placeholder="সিলেক্ট করুন অথবা নিজে টাইপ করুন (যেমন: পদার্থবিজ্ঞান, সমাস, Tense)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              />

              {/* Sub-Tabs: Core Subjects vs. Grammar Topics */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedSubTab('core')}
                    className={'px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ' + (
                      selectedSubTab === 'core' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    📚 মূল বিষয়সমূহ ({customTags.subjects?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSubTab('grammar')}
                    className={'px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ' + (
                      selectedSubTab === 'grammar' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    📝 গ্রামার ও ব্যাকরণ ({customTags.grammarTopics?.length || 0})
                  </button>
                </div>

                <div className="relative flex-1 max-w-[130px]">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    placeholder="ট্যাগ খুঁজুন..."
                    className="w-full pl-6 pr-2 py-0.5 text-[10px] bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Select Scrollable Tag Cloud */}
              <div className="max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-1.5 custom-scrollbar">
                {activeSubjectPills.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTargetBook(s)}
                    className={'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all text-left cursor-pointer ' + (
                      targetBook === s
                        ? selectedSubTab === 'core' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/60 shadow-2xs'
                    )}
                  >
                    {s}
                  </button>
                ))}
                {activeSubjectPills.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic p-1">কোনো ট্যাগ মিলেনি</span>
                )}
              </div>
            </div>

            {/* 3. Institution / Board Name */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">🏛️ শিক্ষা বোর্ড / শীর্ষ প্রতিষ্ঠান নাম *</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTagManager('boards', 'শিক্ষা বোর্ড তালিকা এডিট')}
                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    বোর্ড এডিট
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleOpenTagManager('institutions', 'শীর্ষ কলেজ/প্রতিষ্ঠান তালিকা এডিট')}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    প্রতিষ্ঠান এডিট
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={targetInstitution}
                onChange={(e) => setTargetInstitution(e.target.value)}
                placeholder="যেমন: ঢাকা বোর্ড, নটর ডেম কলেজ, রাজউক উত্তরা মডেল কলেজ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              />

              {/* Board Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 block">কুইক সিলেক্ট (বোর্ডসমূহ):</span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar">
                  {(customTags.boards || DEFAULT_BOARDS).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTargetInstitution(b)}
                      className={'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ' + (
                        targetInstitution === b ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {b.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] font-bold text-slate-400 block pt-1">শীর্ষ কলেজ / প্রতিষ্ঠান:</span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar">
                  {(customTags.institutions || DEFAULT_INSTITUTIONS).map(inst => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setTargetInstitution(inst)}
                      className={'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ' + (
                        targetInstitution === inst ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      )}
                    >
                      {inst.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Year (Mandatory) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">📅 শিক্ষাবর্ষ / সাল (Year) *</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
              >
                {DEFAULT_YEARS.map(y => (
                  <option key={y} value={y}>{y} শিক্ষাবর্ষ (Year {y})</option>
                ))}
              </select>
            </div>

            {/* 5. Optional Chapter / Sub-Topic Tag */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">📑 অধ্যায় / সাব-টপিক ট্যাগ সংযুক্ত করুন</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChapter}
                    onChange={(e) => setHasChapter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {hasChapter && (
                <input
                  type="text"
                  value={targetChapter}
                  onChange={(e) => setTargetChapter(e.target.value)}
                  placeholder="যেমন: অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি অথবা Tense Practice Set"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )}
            </div>

            {/* Live Generated Badge Preview */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900">অটো ব্যাজ প্রিভিউ:</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-mono font-bold text-[11px] shadow-sm">
                {`[${targetInstitution.split('(')[0].trim()} - '${targetYear.slice(-2)}]`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: File Dropzone, AI Text Extractor & Live Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>২. প্রশ্নপত্র আপলোড অথবা টেক্সট পেস্ট</span>
            </h3>

            {/* File Dropzone */}
            <div
              onClick={() => !isParsing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer group ${
                isParsing
                  ? 'border-indigo-400 bg-indigo-50/40 cursor-wait'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.json,.csv,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-inner">
                {isParsing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                ) : (
                  <FolderOpen className="w-6 h-6" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-700">
                {isParsing
                  ? 'ফাইল প্রসেসিং ও প্রশ্ন বিশ্লেষণ চলছে...'
                  : uploadedFileName
                  ? 'নির্বাচিত ফাইল: ' + uploadedFileName
                  : 'ফাইল আপলোড করতে ক্লিক করুন (PDF, DOCX, DOC, TXT, CSV)'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {isParsing ? 'দয়া করে কিছুক্ষণ অপেক্ষা করুন' : 'অথবা নিচের বক্সে সরাসরি কপি-পেস্ট করুন'}
              </p>
            </div>

            {/* Text Paste Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">সরাসরি প্রশ্নপত্র পেস্ট করুন:</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleMCQ = '১. বল ও সরণের গুণফলকে কী বলে?\nক) ক্ষমতা\nখ) শক্তি\nগ) কাজ\nঘ) বেগ\nউত্তর: গ\nব্যাখ্যা: কাজ = বল × বলের অভিমুখে সরণ।';
                      setRawText(sampleMCQ);
                      handleParseRawText(sampleMCQ);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    + ডেমো MCQ
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleCQ = 'উদ্দীপক: ৫০ কেজি ভরের একজন ব্যক্তি ৫ মিনিটে ৫০ মিটার উঁচু পাহাড়ে উঠলেন।\n(ক) কাজ কাকে বলে?\n(খ) ধনাত্মক কাজ বলতে কী বোঝায়?\n(গ) ব্যক্তির দ্বারা কৃতকাজের পরিমাণ নির্ণয় করো।\n(ঘ) ব্যক্তির ক্ষমতা নির্ণয় করো।';
                      setRawText(sampleCQ);
                      handleParseRawText(sampleCQ);
                    }}
                    className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    + ডেমো CQ
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="এখানে বহুনির্বাচনী বা সৃজনশীল প্রশ্ন পেস্ট করুন..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono leading-relaxed"
              />

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setRawText('');
                    setParsedQuestions([]);
                    setUploadedFileName(null);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  ক্লিয়ার করুন
                </button>
                <button
                  type="button"
                  onClick={() => handleParseRawText()}
                  disabled={isParsing || !rawText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isParsing ? 'পার্সিং হচ্ছে...' : 'এআই পার্স করুন (Parse)'}</span>
                </button>
              </div>
            </div>

            {/* Parsed Output & Staging Preview */}
            {parsedQuestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      পার্সড প্রশ্ন তালিকা (মোট: {parsedQuestions.length} টি)
                    </h4>
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setParsedActiveTab('ALL')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                          parsedActiveTab === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                      >
                        সকল ({parsedStats.all})
                      </button>
                      <button
                        type="button"
                        onClick={() => setParsedActiveTab('MCQ')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                          parsedActiveTab === 'MCQ' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        )}
                      >
                        বহুনির্বাচনী MCQ ({parsedStats.mcq})
                      </button>
                      <button
                        type="button"
                        onClick={() => setParsedActiveTab('CQ')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                          parsedActiveTab === 'CQ' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        )}
                      >
                        সৃজনশীল CQ ({parsedStats.cq})
                      </button>
                      <button
                        type="button"
                        onClick={() => setParsedActiveTab('SQ')}
                        className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                          parsedActiveTab === 'SQ' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        )}
                      >
                        সংক্ষিপ্ত SQ ({parsedStats.sq})
                      </button>
                    </div>
                  </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveToRepository}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'রিপোজিটরিতে সংরক্ষণ করুন'}</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                  {filteredParsedQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                          q.type === 'CQ' ? 'bg-purple-100 text-purple-800' :
                          q.type === 'SQ' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-indigo-100 text-indigo-800'
                        )}>
                          {q.type === 'CQ' ? 'সৃজনশীল (CQ)' : q.type === 'SQ' ? 'সংক্ষিপ্ত (SQ)' : 'বহুনির্বাচনী (MCQ)'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                      </div>

                      {q.type === 'CQ' ? (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{q.stem}</p>
                          {(q.diagramUrl || q.diagramCaption) && (
                            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 my-1.5 flex items-center space-x-3">
                              {q.diagramUrl ? (
                                <img src={q.diagramUrl} alt="Diagram" className="w-20 h-16 object-contain rounded-lg border bg-white" />
                              ) : (
                                <div className="w-14 h-12 rounded-lg bg-indigo-100 border border-indigo-200 flex flex-col items-center justify-center text-indigo-700 font-mono text-[9px] shrink-0">
                                  <ImageIcon className="w-4 h-4 text-indigo-600 mb-0.5" />
                                  <span>[চিত্র]</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-indigo-900 block truncate">
                                  📊 {q.diagramCaption || 'উদ্দীপকের চিত্র / লেখচিত্র / বর্তনী'}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {q.diagramUrl ? 'চিত্র সংযুক্ত রয়েছে' : 'ভিজ্যুয়াল প্লেসহোল্ডার সংরক্ষিত'}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700 pt-1">
                            <div>(ক) {q.subQuestions?.a?.q || 'ক নম্বর প্রশ্ন'} [১]</div>
                            <div>(খ) {q.subQuestions?.b?.q || 'খ নম্বর প্রশ্ন'} [২]</div>
                            <div>(গ) {q.subQuestions?.c?.q || 'গ নম্বর প্রশ্ন'} [৩]</div>
                            <div>(ঘ) {q.subQuestions?.d?.q || 'ঘ নম্বর প্রশ্ন'} [৪]</div>
                          </div>
                        </div>
                      ) : q.type === 'SQ' ? (
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-slate-900">{q.question}</p>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] shrink-0 border border-emerald-200">
                              [{q.marks || 2} নম্বর]
                            </span>
                          </div>
                          {(q.diagramUrl || q.diagramCaption) && (
                            <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-200/80 my-1 flex items-center space-x-2.5">
                              {q.diagramUrl ? (
                                <img src={q.diagramUrl} alt="Diagram" className="w-16 h-12 object-contain rounded-lg border bg-white" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-indigo-900 truncate">
                                📊 {q.diagramCaption || 'প্রশ্নের সংশ্লিষ্ট চিত্র / গ্রাফ'}
                              </span>
                            </div>
                          )}
                          {q.shortAnswer && (
                            <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px]">
                              <span className="font-bold text-emerald-800">✅ নমুনা উত্তর: </span>
                              <span>{q.shortAnswer}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">{q.question}</p>
                          {(q.diagramUrl || q.diagramCaption) && (
                            <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-200/80 my-1 flex items-center space-x-2.5">
                              {q.diagramUrl ? (
                                <img src={q.diagramUrl} alt="Diagram" className="w-16 h-12 object-contain rounded-lg border bg-white" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-indigo-900 truncate">
                                📊 {q.diagramCaption || 'প্রশ্নের সংশ্লিষ্ট চিত্র / গ্রাফ'}
                              </span>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                            {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className={q.correctAnswer === ['ক','খ','গ','ঘ'][oIdx] ? 'font-bold text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200' : ''}>
                                {['ক', 'খ', 'গ', 'ঘ'][oIdx]}) {opt}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="text-[10px] text-slate-500 pt-0.5">💡 ব্যাখ্যা: {q.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Central Question Repository Stored Database */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>কেন্দ্রীয় এআই প্রশ্ন ভান্ডার (Stored Question Repository)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              সকল সংরক্ষিত ও প্রশিক্ষিত বিগত সালের প্রশ্নপত্রসমূহ
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
                placeholder="প্রশ্ন, বই বা প্রতিষ্ঠান খুঁজুন..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none w-56 font-medium"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              {['ALL', 'MCQ', 'CQ'].map((tType) => (
                <button
                  key={tType}
                  type="button"
                  onClick={() => setFilterType(tType)}
                  className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ' + (
                    filterType === tType ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {tType === 'ALL' ? 'সকল' : tType}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchRepoQuestions}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={'w-4 h-4 ' + (loadingRepo ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>

        {/* Repository Items List */}
        {filteredRepo.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Database className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold">রিপোজিটরিতে এখনো কোনো প্রশ্ন পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRepo.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                      {item.type || 'MCQ'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {item.year || '2025'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.question || item.stem || 'প্রশ্ন'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-medium text-slate-500">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      📖 {item.book || item.subject || 'সাধারণ'}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      🏛️ {item.institutionOrBoard || item.board || 'বোর্ড'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2">
                  <span className="text-[10px] text-slate-400">
                    {item.className || item.class || 'Class 9-10'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteRepoItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* Dynamic & Live Editable Tags Manager Modal */}
      {/* ========================================================== */}
      {tagModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  {tagModalConfig.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTagModalConfig({ ...tagModalConfig, isOpen: false })}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Custom Tag Form */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">নতুন ট্যাগ যোগ করুন:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
                  placeholder="যেমন: বাংলা ব্যাকরণ: কারক, Voice Change, Class 9..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Existing Tags List (Live Editable & Deletable) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>বর্তমান ট্যাগসমূহ (মোট: {customTags[tagModalConfig.categoryKey]?.length || 0} টি)</span>
                <button
                  type="button"
                  onClick={handleResetCategoryTags}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  ডিফল্ট তালিকায় রিসেট করুন
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200 custom-scrollbar">
                {(customTags[tagModalConfig.categoryKey] || []).map((tagItem, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    {editingTagIdx === idx ? (
                      <div className="flex items-center space-x-1.5 flex-1">
                        <input
                          type="text"
                          value={editingTagText}
                          onChange={(e) => setEditingTagText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditTag(idx); }}
                          autoFocus
                          className="flex-1 px-2.5 py-1 text-xs border border-indigo-300 rounded-lg focus:outline-none font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditTag(idx)}
                          className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                          title="সংরক্ষণ"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTagIdx(null)}
                          className="p-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                          title="বাতিল"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800 truncate flex-1">{tagItem}</span>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTagIdx(idx);
                              setEditingTagText(tagItem);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTag(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTagModalConfig({ ...tagModalConfig, isOpen: false })}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                সম্পন্ন করুন (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
