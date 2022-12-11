import { useEffect, useRef } from 'react';

export default function Main() {
  const mapsContainer = useRef<HTMLElement>(null);
  const coords = useRef<HTMLParagraphElement>(null);
  const address = useRef<HTMLParagraphElement>(null);

  function initMap() {
    const panorama = new google.maps.StreetViewPanorama(
      mapsContainer.current as HTMLElement,
      {
        position: { lat: -23.562755, lng: -47.457893 },
        pov: { heading: 270, pitch: 0 },
        visible: true
      }
    )
  
    panorama.addListener("position_changed", () => {
      (coords.current as HTMLElement).innerText = `lat: ${panorama.getPosition()?.lat().toFixed(6)}, lng: ${panorama.getPosition()?.lng().toFixed(6)}`
    });

    panorama.addListener('links_changed', () => {
      const coords = panorama.getLinks() as google.maps.StreetViewLink[];
      (address.current as HTMLElement).innerText  = coords[0]?.description as string;
    })
  }

  useEffect(() => {
    if (google) initMap();
  }, [])

  return (
    <>
      <main className='flex h-screen w-screen'>
        <div className='grid grid-cols-2 w-full h-full bg-[#121212]'>
          <section ref={mapsContainer} className='relative overflow-hidden'>
            <details open className='absolute bottom-0 left-0 z-10 bg-white h-max w-max p-2 rounded-tr-md'>
              <p ref={coords}></p>
              <p ref={address}></p>
            </details>
          </section>
        </div>
      </main>
    </>
  )
}