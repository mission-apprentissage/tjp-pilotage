
export type ExtraUserInfo = {
  FrEduFonctAdm?: string;
  FrEduRne?: Array<string>;
  FrEduResDel?: Array<string>;
  FrEduRneResp?: Array<string>;
  // Liste des groupes LDAP auxquels l'utilisateur est rattaché
  ctgrps?: Array<string>;
  // Titre de fonction de l'utilisateur
  title?: string;
  // Nécessaire à l'identification du DASEN
  FrEduGestResp?: Array<string>;
  // Code région académique
  codaca?:string;
};

export type TUserEtablissement = {
  codeRegion: string | null;
  uai: string;
} | undefined

export interface UserCommunicationArguments {
  passwordDeleted: boolean;
  userCreated: boolean;
}
