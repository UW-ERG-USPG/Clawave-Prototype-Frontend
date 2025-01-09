import Image from "../lwmap.jpg";
const Home = () => {
  return (
    <div className="container mx-auto gap-4 p-20  bg-slate-200  ">
      <p className="text-3xl font-bold">About Clawave</p>
      <p>
        CLAWAVE is a visualization toolkit developed to transform water quality
        monitoring and decision-making within Canada and beyond, It utilizes
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
      <br />
      <img
        src={Image}
        alt="description"
        style={{ maxWidth: "40%", height: "auto" }}
      />

      <br />
     Pls report any issues found over <a href="https://github.com/UW-ERG-USPG/Clawave-Prototype-Frontend/issues"className="text-blue-500 font-semibold">here.</a>
    </div>
  );
};
export default Home;
