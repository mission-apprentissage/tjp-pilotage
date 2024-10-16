export const getNsfIcon = (codeNsf?: string): string => {
  if (!codeNsf) {
    return "solar:question-mark-linear";
  }

  const subCode = codeNsf.substring(0, 2);
  return (
    {
      ["10"]: "solar:square-academic-cap-linear",
      ["11"]: "solar:atom-linear",
      ["12"]: "solar:globus-linear",
      ["13"]: "solar:masks-linear",
      ["19"]: "solar:square-academic-cap-linear",
      ["20"]: "solar:shock-absorber-linear",
      ["21"]: "solar:leaf-linear",
      ["22"]: "solar:black-hole-2-linear",
      ["23"]: "solar:buildings-2-linear",
      ["24"]: "solar:t-shirt-linear",
      ["25"]: "solar:lightbulb-bolt-linear",
      ["29"]: "solar:settings-linear",
      ["30"]: "solar:users-group-two-rounded-linear",
      ["31"]: "solar:chart-linear",
      ["32"]: "solar:dialog-linear",
      ["33"]: "solar:user-heart-rounded-linear",
      ["34"]: "solar:shield-user-linear",
      ["39"]: "solar:paint-roller-linear",
      ["41"]: "solar:hiking-round-linear",
      ["42"]: "solar:balls-linear",
      ["49"]: "solar:sun-2-linear",
      ["99"]: "solar:folder-2-linear",
    }[subCode] ?? "solar:question-mark-linear"
  );
};
