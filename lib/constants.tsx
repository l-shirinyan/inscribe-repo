import { useTranslations } from 'next-intl';

export const useContent = () => {
  const t = useTranslations('Content');
  
  return [
    {
      title: t('preamble.title'),
      paragraphs: t.raw('preamble.paragraphs'),
    },
    {
      title: t('scopeAndHierarchy.title'),
      subsections: t.raw('scopeAndHierarchy.subsections'),
    },
    {
      title: t('articleI.title'),
      list: t.raw('articleI.list'),
    },
    {
      title: t('articleII.title'),
      list: t.raw('articleII.list'),
    },
    {
      title: t('articleIII.title'),
      list: t.raw('articleIII.list'),
    },
    {
      title: t('articleIV.title'),
      list: t.raw('articleIV.list'),
    },
    {
      title: t('articleV.title'),
      paragraphs: t.raw('articleV.paragraphs'),
      list: t.raw('articleV.list'),
    },
    {
      title: t('closingAffirmation.title'),
      paragraphs: t.raw('closingAffirmation.paragraphs'),
    },
  ];
};