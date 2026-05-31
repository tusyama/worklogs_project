import { maxWidthQuery } from "../../theme/media";
import { useMediaQuery } from "./useMediaQuery";

export function useIsMobile(): boolean {
  return useMediaQuery(maxWidthQuery("md"));
}
