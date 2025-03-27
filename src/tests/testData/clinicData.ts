import { faker } from "@faker-js/faker";
import path from "path";
import { getAllcode, getBase64, randomValue } from "../../utils/commonUtils";

const _imagePath = path.resolve(__dirname, "./image-add-new.png");

export interface ClinicDataType {
  name: string;
  address: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
  provinceId: string;
  image: string;
}

/**
 *
 * @param imagePath (optional) default by using image-add-new.png
 * @returns
 */
export async function randomClinicData(
  imagePath?: string
): Promise<ClinicDataType> {
  const provinces = await getAllcode("PROVINCE");
  const description = faker.book.title();
  let clinic = {
    name: `Clinic Name Test - ${faker.number.int(1000)}`,
    address: faker.location.city(),
    descriptionMarkdown: `**${description}**`,
    descriptionHTML: `<p><strong>${description}</strong></p>`,
    provinceId: randomValue(provinces).key,
    image: `data:image/png;base64, ${getBase64(
      imagePath ? imagePath : _imagePath
    )}`,
  };
  return clinic;
}

export const emptyClinicData: ClinicDataType = {
  name: "",
  address: "",
  descriptionMarkdown: "",
  descriptionHTML: "",
  provinceId: "",
  image: "",
};
