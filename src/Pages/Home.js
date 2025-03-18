import Image from "../lwmap.jpg";

const Home = () => {
  return (
    <div className="container mx-auto p-20 bg-slate-200">
      <p className="text-3xl font-bold mb-8">About Clawave</p>
      
      <div className="flex gap-8">
        {/* Text container */}
        <div className="w-1/2">
          <p className="text-lg leading-relaxed">
            CLAWAVE is a visualization toolkit developed to transform water quality
            monitoring and decision-making within Canada and beyond. It utilizes
            both historical and newly gathered water quality data to streamline
            processes for watershed managers, thus expediting the transfer of water
            quality knowledge into actionable strategies. This prototype is designed
            to demonstrate its robust capabilities in various assessing nutrient
            loads in Lake Winnipeg. Additionally, CLAWAVE’s advanced storytelling
            and visualization features are engineered to make water quality data
            more accessible and interpretable for all stakeholders, enhancing
            community involvement and empowering especially Indigenous communities
            to take a more active role in managing their water resources
            effectively.
          </p>
        </div>

        {/* Image container */}
        <div className="w-1/2">
          <img
            src={Image}
            alt="Lake Winnipeg map visualization"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Map</h2>
          <p className="text-gray-600">Interact with the map to view water monitoring stations across Canada. Click station markers to see detailed information (e.g., location, metrics), access its raw data, and generate customized graphs with that data."</p>
        </div>

        {/* Data Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Data</h2>
          <p className="text-gray-600">View water quality and discharge data from water monitoring stations across Canada.</p>
        </div>

        {/* Graphs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Graphs</h2>
          <p className="text-gray-600">Select a station and select from a variety of characteristics and graph types. Create multiple graphs to compare data between different stations and characteristics.</p>
        </div>
      </div>

      <div className="mt-8">
        Please report any issues found over{" "}
        <a 
          href="https://github.com/UW-ERG-USPG/Clawave-Prototype-Frontend/issues"
          className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
        >
          here.
        </a>
      </div>
    </div>
  );
};

export default Home;
