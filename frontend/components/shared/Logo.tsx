import Link from "next/link";
import { PiStudentFill } from "react-icons/pi";

const Logo = () => {
  return (
    <Link href={`/`} className="flex items-end">
      <PiStudentFill className="text-color1 md:text-4xl text-3xl" />
      <span className="text-color2 md:text-lg">ClassMate+</span>
    </Link>
  );
};

export default Logo;
