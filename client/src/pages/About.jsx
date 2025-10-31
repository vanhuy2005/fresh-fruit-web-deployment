import { useAppContext } from "../context/AppContext";
import { images } from "../images";

function About() {
  const { user } = useAppContext();

  const stats = [
    { number: "50K+", label: "Khách hàng hài lòng" },
    { number: "100+", label: "Sản phẩm cao cấp" },
    { number: "24/7", label: "Hỗ trợ khách hàng" },
    { number: "5★", label: "Đánh giá trung bình" },
  ];

  const values = [
    {
      emoji: "🍎",
      title: "Chất lượng hàng đầu",
      description:
        "Mỗi loại trái cây đều được chọn lọc kỹ lưỡng để đảm bảo bạn nhận được sản phẩm tươi ngon nhất.",
      gradient: "from-red-50 to-pink-50",
    },
    {
      emoji: "🚚",
      title: "Giao hàng nhanh chóng",
      description:
        "Từ nông trại đến bàn ăn của bạn trong vòng 24 giờ, giữ trọn độ tươi ngon và dinh dưỡng.",
      gradient: "from-blue-50 to-cyan-50",
    },
    {
      emoji: "🌱",
      title: "Phát triển bền vững",
      description:
        "Hỗ trợ canh tác thân thiện với môi trường và giảm thiểu tác động sinh thái.",
      gradient: "from-green-50 to-emerald-50",
    },
    {
      emoji: "💚",
      title: "Khách hàng là ưu tiên hàng đầu",
      description:
        "Sự hài lòng của bạn là mục tiêu của chúng tôi — mang đến trải nghiệm mua sắm trái cây tuyệt vời nhất.",
      gradient: "from-emerald-50 to-teal-50",
    },
    {
      emoji: "🌏",
      title: "Đa dạng lựa chọn",
      description:
        "Từ trái cây Việt Nam đến các loại nhập khẩu cao cấp — tất cả đều có tại một nơi.",
      gradient: "from-violet-50 to-purple-50",
    },
    {
      emoji: "✨",
      title: "Luôn tươi mới",
      description:
        "Chúng tôi đảm bảo trái cây luôn tươi mỗi ngày với cam kết chất lượng bạn có thể cảm nhận được.",
      gradient: "from-yellow-50 to-orange-50",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-20 px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-green-300/30 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Mang tinh túy thiên nhiên
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Đến tận cửa nhà bạn
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Không chỉ là một cửa hàng trái cây — chúng tôi đồng hành cùng bạn trong hành trình sống khỏe mạnh và hạnh phúc hơn với trái cây tươi ngon, chất lượng cao.
            </p>
          </div>

          {/* Welcome Message */}
          {user && (
            <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 mb-8 text-center shadow-lg max-w-2xl mx-auto">
              <p className="text-lg text-gray-700">
                Chào mừng {user.firstName} {user.lastName} đã trở lại
                <span className="font-bold text-green-600">{user.name}</span>
                <br />
                <span className="text-sm text-gray-600">
                  Cảm ơn bạn đã là một phần của gia đình chúng tôi
                </span>
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 border border-green-100"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-6 md:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Được thành lập với niềm tin đơn giản rằng{" "}
                  <span className="font-semibold text-gray-800">
                    mọi người đều xứng đáng được thưởng thức trái cây tươi ngon và bổ dưỡng
                  </span>
                  . Từ một dự án nhỏ xuất phát từ đam mê, chúng tôi đã phát triển thành một nền tảng thương mại điện tử phục vụ hàng ngàn khách hàng trên khắp cả nước.
                </p>
                <p>
                  Chúng tôi hợp tác trực tiếp với các nông trại và nhà cung cấp uy tín trong và ngoài nước, đảm bảo mỗi quả đều đạt tiêu chuẩn chất lượng nghiêm ngặt.  
                  Từ những vườn cây xanh mướt ở đồng bằng sông Cửu Long đến các trang trại nhập khẩu, chúng tôi mang đến cho bạn{" "}
                  <span className="font-semibold text-gray-800">
                    tinh hoa của thiên nhiên
                  </span>
                  .
                </p>
                <p>
                  Sứ mệnh của chúng tôi không chỉ là bán trái cây — mà còn là xây dựng cộng đồng những người yêu thích lối sống lành mạnh.  
                  Mỗi đơn hàng của bạn góp phần thúc đẩy nông nghiệp bền vững và tạo dựng một tương lai khỏe mạnh hơn cho tất cả mọi người.
                </p>
              </div>

              {/* Call to Action */}
              {/* <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Mua ngay
                </button>
                <button className="bg-white border-2 border-gray-200 hover:border-green-500 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-md">
                  Tìm hiểu thêm
                </button>
              </div> */}
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 aspect-square flex items-center justify-center">
                  <span className="text-6xl">🍎</span>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-6 aspect-square flex items-center justify-center">
                  <span className="text-6xl">🍊</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-6 aspect-square flex items-center justify-center">
                  <span className="text-6xl">🍎</span>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl p-6 aspect-square flex items-center justify-center">
                  <span className="text-6xl">🍇</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Vì sao nên chọn chúng tôi?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến sự xuất sắc trong từng khía cạnh của dịch vụ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-1"
              >
                <div
                  className={`bg-gradient-to-br ${value.gradient} p-6 flex items-center justify-center`}
                >
                  <div className="text-6xl">{value.emoji}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-6 md:px-16 lg:px-24 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-95 mb-8">
            Chúng tôi mong muốn thay đổi cách mọi người trải nghiệm trái cây — mang chất lượng cao cấp đến với mọi nhà, đồng thời ủng hộ nông nghiệp bền vững và cộng đồng địa phương.  
            Cùng nhau, chúng ta xây dựng một thế giới khỏe mạnh và hạnh phúc hơn — từng quả trái cây một.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span>Canh tác bền vững</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <span>Hỗ trợ nông dân</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💪</span>
              <span>Cộng đồng khỏe mạnh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial/Trust Section */}
      <div className="py-16 px-6 md:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Được tin tưởng bởi hàng ngàn khách hàng
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Hãy cùng tham gia cộng đồng những khách hàng đã lựa chọn lối sống tươi mới và lành mạnh hơn
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Trái cây tươi nhất mà tôi từng đặt online! Giao hàng luôn đúng hẹn và chất lượng tuyệt vời.",
                author: "Nguyễn Thu Hà",
                location: "Hà Nội",
              },
              {
                quote:
                  "Rất nhiều lựa chọn từ trái cây Việt đến nhập khẩu. Dịch vụ chăm sóc khách hàng cực kỳ chu đáo.",
                author: "Trần Minh Khôi",
                location: "TP. Hồ Chí Minh",
              },
              {
                quote:
                  "Tôi thích việc họ ủng hộ nông nghiệp bền vững! Trái cây ngon hơn khi biết được nguồn gốc đáng tin cậy.",
                author: "Lê Phương Anh",
                location: "Đà Nẵng",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-6 border border-gray-100"
              >
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="font-semibold text-gray-800">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
