import { IAuthor } from '../models/author.model';
import { ILibrary } from '../models/library.model';

export type BookInputValidationResult =
  | {
      isValid: true;
      author: IAuthor;
      library: ILibrary;
    }
  | {
      isValid: false;
      httpCode: number;
      message: string;
    };
