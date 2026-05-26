export const formatQuestionType = (type) => {
  if (!type || type === 'Other' || type === 'General') return 'General Questions';
  
  const typeMap = {
    'multiple_choice': 'Multiple Choice',
    'fill_in_the_blank': 'Fill in the Blanks',
    'true_false_not_given': 'True / False / Not Given',
    'yes_no_not_given': 'Yes / No / Not Given',
    'matching_headings': 'Matching Headings',
    'matching_paragraphs': 'Matching Paragraphs',
    'short_answer': 'Short Answer'
  };

  if (typeMap[type]) return typeMap[type];

  // fallback for unexpected types
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};