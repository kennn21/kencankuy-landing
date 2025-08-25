"use client";

import { Apple, Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button"; // Corrected import path
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { PROTOTYPE_APP_PATH } from "@/constants/path.const";

type CallToActionsProps = {
  type?: "prototype" | "release";
};

const motionDivVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.05, y: -3 },
  tap: { scale: 0.95 },
};

const CallToActions: React.FC<CallToActionsProps> = ({ type = "release" }) => {
  const router = useRouter();

  const onClickPrototype = () => {
    router.push(PROTOTYPE_APP_PATH);
  };

  if (type === "prototype") {
    return (
      <motion.div
        className="flex justify-center lg:justify-start"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.3 },
        }}
      >
        <motion.div
          variants={motionDivVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            size="lg"
            className="shadow-lg flex items-center bg-brand-pink gap-2 text-white py-4 px-6 rounded-lg hover:bg-pink-400 cursor-pointer transition-colors"
            onClick={onClickPrototype}
          >
            <Heart className="animate-pulse" />
            <span>Try it now</span>
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="flex flex-wrap justify-center lg:justify-start gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }}
    >
      <motion.div
        variants={motionDivVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <Button className="flex items-center bg-black text-white h-auto py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          <Apple className="w-6 h-6 mr-2" />
          <span className="text-left text-xs leading-tight">
            Download on the <br />{" "}
            <span className="text-base font-semibold">App Store</span>
          </span>
        </Button>
      </motion.div>
      <motion.div
        variants={motionDivVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <Button className="flex items-center bg-black text-white h-auto py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          <Play className="w-6 h-6 mr-2" />
          <span className="text-left text-xs leading-tight">
            GET IT ON <br />{" "}
            <span className="text-base font-semibold">Google Play</span>
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CallToActions;
