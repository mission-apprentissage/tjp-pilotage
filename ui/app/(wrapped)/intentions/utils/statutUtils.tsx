export const formatStatut = (statut: string) => {
  switch (statut) {
    case "draft":
      return "Projet de demande";
    case "submitted":
      return "Validée";
    case "refused":
      return "Refusée";
    case "deleted":
      return "Supprimée";
    default:
      return "";
  }
};
