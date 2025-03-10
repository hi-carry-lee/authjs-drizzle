import { toast } from "sonner";

interface Props {
  title: string;
  message: string;
  duration?: number;
  bg?: string;
  textColor?: string;
}

function toastUtil({
  title,
  message,
  duration = 1500,
  bg = "bg-green-500",
  textColor = "text-gray-200",
}: Props) {
  return toast.custom(
    (t) => (
      <div
        className={`relativ dark:bg-gray-800 p-4 rounded-lg shadow-lg ${bg} ${textColor}`}
      >
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          x
        </button>
        <h3 className="font-bold">{title}</h3>
        <p>{message}</p>
      </div>
    ),
    {
      duration: duration, // 持续时间，单位为毫秒（默认是3000毫秒）
      // 其他可选配置
      // position: "top-center", // 位置
      // id: "password-updated", // 唯一ID
      // icon: "🔑",
    }
  );
}

export default toastUtil;
