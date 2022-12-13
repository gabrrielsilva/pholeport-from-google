import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';

const STARTING_LOCATION = { lat: -23.5557714, lng: -46.6395571 };

export default function Main() {
  const [printSuccess, setPrintSuccess] = useState<boolean | null>(null);
  const panoramaContainer = useRef<HTMLElement>(null);
  const mapContainer = useRef<HTMLElement>(null);
  const placesSearchBox = useRef<HTMLInputElement>(null);
  const coords = useRef<HTMLParagraphElement>(null);
  const address = useRef<HTMLParagraphElement>(null);
  
  function initialize() {
    const searchBox = new google.maps.places.SearchBox(placesSearchBox.current as HTMLInputElement);
    
    const panorama = new google.maps.StreetViewPanorama(
      panoramaContainer.current as HTMLElement,
      {
        position: STARTING_LOCATION,
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
        center: STARTING_LOCATION,
        zoom: 18,
      }
    );

    map.setStreetView(panorama);
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    let markers: google.maps.Marker[] = [];

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces() as google.maps.places.PlaceResult[];
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and STARTING_LOCATION.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  async function print() {

    try {
      const canvas = await html2canvas(panoramaContainer.current as HTMLElement);
      canvas.toBlob(async blob => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob as Blob })]);
      });
      setPrintSuccess(true);
    } catch (e) {
      console.log('Oopss, algo deu errado!');
      setPrintSuccess(false);
    }
  }

  useEffect(() => {
    if (google) initialize();
  }, [])

  return (
    <>
      <main className='flex items-center justify-center w-screen h-screen bg-[#1f2028]'>
        <div className='w-full max-w-6xl overflow-hidden rounded h-4/5'>
          <div className='grid w-full h-full grid-cols-2'>
            <section ref={panoramaContainer} className='relative overflow-hidden'>
              <details  open className='absolute bottom-0 left-0 z-10 p-2 pb-5 text-xl bg-white h-max w-max rounded-tr-md'>
                <summary>Coords and address</summary>
                <p ref={coords}></p>
                <p ref={address}></p>
              </details>
            </section>
            <div className='w-full h-full'>
              <section ref={mapContainer} className='w-full h-1/2'></section>
              <section className='w-full p-5 bg-[#011627] h-1/2 space-y-5'>
                <input ref={placesSearchBox} type="text" placeholder='Onde quer ir?' className='w-full p-2 rounded focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/50'/>
                <Button text='Print' onClick={print} extraStyles='bg-[#3992ff] text-white hover:bg-blue-600 focus:ring-blue-200' />
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}