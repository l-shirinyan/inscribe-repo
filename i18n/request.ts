import {
  getRequestConfig,
  type GetRequestConfigParams,
  type RequestConfig,
} from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(
  async ({ requestLocale }: GetRequestConfigParams): Promise<RequestConfig> => {
    let locale = await requestLocale as any;

    if (!locale || !routing.locales.includes(locale)) {
      locale = routing.defaultLocale;
    }

    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  }
);
