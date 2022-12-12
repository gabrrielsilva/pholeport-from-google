import { useEffect, useRef } from 'react';

const LOCATION = { lat: -23.568333, lng: -46.623366 };

export default function Main() {
  const panoramaContainer = useRef<HTMLElement>(null);
  const mapContainer = useRef<HTMLElement>(null);
  const coords = useRef<HTMLParagraphElement>(null);
  const address = useRef<HTMLParagraphElement>(null);

  function initialize() {
    const panorama = new google.maps.StreetViewPanorama(
      panoramaContainer.current as HTMLElement,
      {
        position: LOCATION,
        pov: { heading: 270, pitch: 0 },
        visible: true,
        disableDefaultUI: true,
        zoom: 0
      }
    )
  
    panorama.addListener("position_changed", () => {
      (coords.current as HTMLElement).innerText = `lat: ${panorama.getPosition()?.lat().toFixed(6)}, lng: ${panorama.getPosition()?.lng().toFixed(6)}`
    });

    panorama.addListener('links_changed', () => {
      const coords = panorama.getLinks() as google.maps.StreetViewLink[];
      (address.current as HTMLElement).innerText  = coords[0]?.description as string;
    })

    const map = new google.maps.Map(
      mapContainer.current as HTMLElement,
      {
        center: LOCATION,
        zoom: 18,
      }
    );

    map.setStreetView(panorama);
  }

  useEffect(() => {
    if (google) initialize();
  }, [])

  return (
    <>
      <main className='flex items-center justify-center w-screen h-screen bg-[#121212]'>
        <div className='w-full max-w-6xl h-4/5'>
          <div className='grid w-full h-full grid-cols-2'>
            <section ref={panoramaContainer} className='relative overflow-hidden'>
              <details  open className='absolute bottom-0 left-0 z-10 p-2 pb-5 text-xl bg-white h-max w-max rounded-tr-md'>
                <summary>Coords and Address</summary>
                <p ref={coords}></p>
                <p ref={address}></p>
              </details>
            </section>
            <div className='h-full'>
              <section ref={mapContainer} className='w-full h-1/2'></section>
              <section className='w-full bg-indigo-800 h-1/2'></section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}