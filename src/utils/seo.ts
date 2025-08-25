import { SITE } from '../config';

/**
 * SEO 메타데이터 생성을 위한 유틸리티 함수들
 */

/**
 * 페이지 타이틀 생성
 */
export function generatePageTitle(title: string, includeSiteName = true): string {
  if (!includeSiteName || title === SITE.title) {
    return title;
  }
  return `${title} | ${SITE.title}`;
}

/**
 * 메타 설명 생성 (최대 160자)
 */
export function generateMetaDescription(description: string): string {
  const maxLength = 160;
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * 캐노니컬 URL 생성
 */
export function generateCanonicalURL(path: string): string {
  const base = SITE.url.endsWith('/') ? SITE.url.slice(0, -1) : SITE.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * 태그를 URL 친화적인 슬러그로 변환
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * 읽기 시간 계산 (한글 기준)
 */
export function calculateReadingTime(content: string): number {
  // 한글은 분당 약 500자, 영어는 분당 약 200단어 기준
  const koreanChars = (content.match(/[가-힣]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  
  const koreanMinutes = koreanChars / 500;
  const englishMinutes = englishWords / 200;
  
  const totalMinutes = Math.ceil(koreanMinutes + englishMinutes);
  return Math.max(1, totalMinutes);
}

/**
 * 구조화 데이터를 위한 저자 정보 생성
 */
export function generateAuthorSchema(authors: string[]) {
  if (authors.length === 1) {
    return {
      '@type': 'Person',
      name: authors[0],
    };
  }
  
  return authors.map(author => ({
    '@type': 'Person',
    name: author,
  }));
}

/**
 * 날짜를 ISO 8601 형식으로 변환
 */
export function toISOString(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * BreadcrumbList 스키마 생성
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQ 스키마 생성
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo 스키마 생성
 */
export function generateHowToSchema(data: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    totalTime: data.totalTime,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}