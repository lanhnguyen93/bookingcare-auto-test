import { faker } from "@faker-js/faker";
import path from "path";
import { getBase64 } from "../../utils/commonUtils";

const _imagePath = path.resolve(__dirname, "./image-add-new.png");

export interface SpecialtyDataType {
  name: string;
  image: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
}

/**
 *
 * @param imagePath (optional) default by using image-add-new.png
 * @returns
 */
export function randomSpecialtyData(imagePath?: string): SpecialtyDataType {
  const description = faker.book.title();
  let specialty = {
    name: `Specialty Name Test1 - ${faker.number.int(1000)}`,
    image: `data:image/png;base64, ${getBase64(
      imagePath ? imagePath : _imagePath
    )}`,
    descriptionMarkdown: `**${description}**`,
    descriptionHTML: `<p><strong>${description}</strong></p>`,
  };
  return specialty;
}

export const emptySpecialData: SpecialtyDataType = {
  name: "",
  image: "",
  descriptionHTML: "",
  descriptionMarkdown: "",
};
