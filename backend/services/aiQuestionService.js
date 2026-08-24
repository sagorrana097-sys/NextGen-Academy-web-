const { StudyMaterial } = require('../models');
const { generateMCQs } = require('./mcqAiGeneratorService');
const { generateCreativeQuestions } = require('./cqAiGeneratorService');

/**
 * AI Question Service with Study Material Source-Context Support
 * Creates questions strictly locked to uploaded source materials (PDFs, Notes, Books).
 */
async function generateQuestions({
  type = 'MCQ', // 'MCQ' | 'CQ'
  subject = '',
  classGrade = '',
  topic = '',
  difficulty = 'MEDIUM',
  questionCount = 5,
  chapterNotes = '',
  sourceMaterialId = null
}) {
  let materialContext = chapterNotes || '';
  let sourceMaterial = null;

  if (sourceMaterialId) {
    sourceMaterial = await StudyMaterial.findByPk(sourceMaterialId);
    if (sourceMaterial) {
      const extracted =
        sourceMaterial.content_text ||
        sourceMaterial.contentText ||
        sourceMaterial.extracted_text ||
        sourceMaterial.descriptionBn ||
        '';
      if (extracted) {
        materialContext = extracted;
      }
    }
  }

  if (type === 'CQ' || type === 'CREATIVE') {
    return generateCreativeQuestions({
      subject,
      classGrade,
      chapterTopic: topic,
      difficulty,
      questionCount,
      chapterNotes: materialContext,
      sourceMaterialId,
      sourceMaterialTitle: sourceMaterial?.title || sourceMaterial?.titleBn
    });
  }

  return generateMCQs({
    topic,
    subject,
    classGrade,
    difficulty,
    questionCount,
    chapterNotes: materialContext,
    sourceMaterialId,
    sourceMaterialTitle: sourceMaterial?.title || sourceMaterial?.titleBn
  });
}

module.exports = {
  generateQuestions
};
