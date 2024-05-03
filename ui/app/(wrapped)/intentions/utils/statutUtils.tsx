export const formatStatut = (statut: string) => {
  switch (statut) {
    case "draft":
      return "Brouillon";
    case "submitted":
      return "Acceptée";
    case "refused":
      return "Refusée";
    case "deleted":
      return "Supprimée";
    default:
      return "";
  }
};
