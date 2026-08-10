import Image from "next/image";
import portalGold from "@lexgate/brand/assets/portal-gold.svg";

/**
 * The mark is supplied by @lexgate/brand, which LG-BRAND-001 names as the
 * single approved supply point. Importing it as a module rather than by public
 * path means there is exactly one copy, the bundler fingerprints it, and an
 * unreferenced mark cannot linger unnoticed in the public directory.
 */
export const PortalMark = () => (
  <Image
    className="portal-mark"
    src={portalGold}
    alt=""
    width={32}
    height={32}
    unoptimized
  />
);
