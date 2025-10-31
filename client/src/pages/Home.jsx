import MainBanner from "../components/Mainbanner";
import Categories from "../components/Categories";
import Bestseller from "../components/Bestseller";
import Bottombanner from "../components/Bottombanner";

function Home() {
  return (
    <div className="min-h-screen font-outfit">
      <MainBanner />
      <div className="-mt-4">
        <Categories />
      </div>
      <div className="-mt-4">
        <Bestseller />
      </div>
      <div className="-mt-4">
        <Bottombanner />
      </div>
    </div>
  );
}

export default Home;
