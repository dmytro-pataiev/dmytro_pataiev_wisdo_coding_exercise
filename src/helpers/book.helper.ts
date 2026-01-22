import { BookInputValidationResult } from '../types/books.type';
import { AuthorModel } from '../models/author.model';
import { LibraryModel } from '../models/library.model';

export const validateInputEntities = async (input: {
  validatedData: Record<string, any>;
  userLibraries: string[];
}): Promise<BookInputValidationResult> => {
  const { validatedData, userLibraries } = input;

  if (validatedData.library && !userLibraries.includes(validatedData.library)) {
    return {
      isValid: false,
      httpCode: 403,
      message: 'You are not a member of the target library',
    };
  }

  const author = await AuthorModel.findById(validatedData.author);

  if (!author) {
    return {
      isValid: false,
      httpCode: 404,
      message: 'Author not found',
    };
  }

  const library = await LibraryModel.findById(validatedData.library);

  if (!library) {
    return {
      isValid: false,
      httpCode: 404,
      message: 'Library not found',
    };
  }

  return { isValid: true, author, library };
};
