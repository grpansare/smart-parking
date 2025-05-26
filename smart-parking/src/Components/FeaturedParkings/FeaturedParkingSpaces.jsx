import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaStar, FaUserCircle } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavLink } from "react-router-dom";
import ViewOnMapModal from "../ViewOnMapModal/ViewOnMapModal";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2, slidesToScroll: 1 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
};

const FeaturedParkingSpaces = () => {
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [sliderSettings, setSliderSettings] = useState(settings);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const [open, setOpen] = useState(false);
  const [parkingSpot, setparkingSpot] = useState();

  const handleOpenModal = (spot) => {
    setparkingSpot(spot);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/parkingspaces/getAllParkingSpaces")
      .then((res) => {
        setFeaturedSpots(res.data);
        const count = res.data.length;

        const adjustedSettings = {
          ...settings,
          slidesToShow: count < 3 ? count : 3,
          centerMode: res.data.length === 1,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: count < 2 ? count : 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        };

        setSliderSettings(adjustedSettings);
        setLoading(false); // ✅ Stop loading
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Even on error, stop loading
      });
  }, []);

  return (
    <div className="p-12">
      <h2 className="text-2xl text-center font-bold mb-4">
        Park like a Pro – Popular Spaces
      </h2>

      {/* ✅ Loader */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loader mx-auto mb-4 border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          <p>Loading parking spots...</p>
        </div>
      ) : (
        <div className="gap-2 mt-8">
          {featuredSpots.length > 1 ? (
            <Slider {...sliderSettings}>
              {featuredSpots.map((spot, index) => (
                <div key={index} className="px-3">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
                    <img
                      src={`http://localhost:8081/${spot.parkingSpaceImage}`}
                      alt={spot.lotName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold">{spot.lotName}</h3>
                      <p className="text-gray-600">{spot.address}</p>
                      <a
                        onClick={() => handleOpenModal(spot)}
                        className="text-blue-600 hover:underline block mt-2"
                      >
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : featuredSpots.length === 1 ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <img
                  src={
                    `http://localhost:8081/${featuredSpots[0].parkingSpaceImage}` ||
                    "parkingspace.jpeg"
                  }
                  alt={featuredSpots[0].lotName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">
                    {featuredSpots[0].lotName}
                  </h3>
                  <p className="text-gray-600">{featuredSpots[0].address}</p>
                  <a
                    onClick={() => handleOpenModal(featuredSpots[0])}
                    className="text-blue-600 hover:underline block mt-2"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No featured parking spaces available.
            </p>
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <NavLink
          to="/parkingspaces"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition-colors"
        >
          Explore All Parking Spaces
        </NavLink>
      </div>

      {parkingSpot && (
        <ViewOnMapModal
          parking_spot={parkingSpot}
          open={open}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FeaturedParkingSpaces;
