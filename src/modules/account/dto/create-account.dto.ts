export class CreateAccountDto {
  name?: string;

  username: string;

  photo?: string;

  gallery?: string[];

  age?: number;

  gender?: number;

  description?: string;

  followers: number;

  location?: string;
}
