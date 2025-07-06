export const languages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "vi", name: "Tiếng Việt" },
];

export const getAllLabel = (currentLangCode: string) => {
  switch (currentLangCode) {
    case "en":
      return "All";
    case "ja":
      return "すべて";
    case "vi":
      return "Tất cả";
    case "ko":
    default:
      return "전체";
  }
};
