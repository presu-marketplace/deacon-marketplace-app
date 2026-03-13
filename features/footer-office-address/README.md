# Feature: Footer Office Address

## Description
Displays the PRESU office physical address in the website footer, linked to Google Maps for easy navigation.

## Address
- **ES**: Av. del Libertador 2442 4° Piso, B1636 Olivos, Provincia de Buenos Aires.
- **EN**: 2442 Del Libertador Ave., 4th Floor, B1636 Olivos, Buenos Aires Province.

## Placement
The address appears between the social icons (Instagram, LinkedIn, WhatsApp) and the copyright line. This keeps the "connect" section (social + location) grouped before the legal text at the bottom.

## Implementation Details
- A map-pin icon (`HiOutlineLocationMarker`) is shown alongside the address text.
- The address is wrapped in an `<a>` tag linking to Google Maps, opening in a new tab.
- The address is locale-aware: Spanish uses "Av." and "4° Piso", English uses "Ave." and "4th Floor".

## Files Modified
- `src/lib/footerTranslations.ts` — added `address` key
- `src/components/layout/Footer.tsx` — added address block with icon and link
