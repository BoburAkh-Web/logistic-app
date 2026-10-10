import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const Modal = ({ showModal, onClose }) => {
  const modalRef = useRef();
  const handleCloseModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  useEffect(() => {
    const closeModalOnEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeModalOnEsc);

    return () => {
      document.removeEventListener("keydown", closeModalOnEsc);
    };
  }, [onClose]);
  if (!showModal) return null;
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleCloseModal}
      ref={modalRef}
    >
      <div className="bg-white p-8 rounded-md shadow-lg">
        <p className="text-2xl font-semibold mb-4">
          Thank you for your response!
        </p>
        <p>We will get back to you soon.</p>
        <button
          onClick={onClose}
          className="mt-6 py-2 px-4 bg-primaryClr text-white rounded-md font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Contact = () => {
  const form = useRef();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    emailjs
      .sendForm(
        "service_25mq3kk",
        "template_aqvfzf6",
        form.current,
        "QOKdEBO-H1pa7cSSd"
      )
      .then(
        (result) => {
          setIsLoading(false);
          setShowModal(true);
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          setIsLoading(false);
        }
      );
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="w-fit mx-auto mt-[50px]" id="contact">
      <div className="container mx-auto flex justify-between tablet-mini:flex-col">
        <div className="max-w-[100%] mr-16 mt-[70px] tablet-mini:mr-0">
          <h1 className="max-w-[100%] text-[40px] font-semibold mb-[30px] tablet:text-[35px] tablet:mb-[20px] mobile:text-[25px]">
            Contact Us
          </h1>
          <form
            className="flex flex-col mt-[40px]"
            // action="https://echo.htmlacademy.ru/"
            ref={form}
            onSubmit={sendEmail}
          >
            <input
              className="text-[20px]  text-grey font-medium border-b-[2px] border-solid w-[350px] outline-none pb-2 mobile:text-[15px] mobile:w-[300px]"
              type="text"
              name="user_name"
              placeholder="Full Name"
              required
            />
            <input
              className="text-[20px] mt-[40px] text-grey font-medium border-b-[2px] border-solid w-[350px] outline-none pb-2 mobile:text-[15px] mobile:w-[300px]"
              type="tel"
              name="user_number"
              placeholder="+1 | Phone Number"
              required
            />
            <input
              className="text-[20px] mt-[40px] text-grey font-medium border-b-[2px] border-solid w-[350px] outline-none pb-2 mobile:text-[15px] mobile:w-[300px]"
              type="email"
              name="user_email"
              placeholder="Email"
              required
            />
            <textarea
              className="text-[20px] mt-[40px] text-grey font-medium border-b-[2px] border-solid w-[350px] outline-none pt-3 mobile:text-[15px] mobile:w-[300px]"
              placeholder="Message"
              cols="30"
              rows="3"
              name="message"
            ></textarea>
            <button
              type="submit"
              value="Send"
              className="pt-3 pb-3 tracking-wider mt-6 border-none w-[350px] border-[4px] rounded-[30px] bg-primaryClr hover:shadow-box-shadow text-white mobile:w-[300px] "
            >
              SEND
            </button>
          </form>
        </div>
        <div className="max-w-[100%] bg-primaryClr mt-[51px] w-[500px]  relative tablet:w-[450px] tablet-mini:mb-[50px] mobile:w-[330px]">
          <div className="w-7 h-7 bg-slate-300 absolute left-[-11px] top-[-11px] shadow-[grey] drop-shadow-2xl md:shadow mobile:w-5 mobile:h-5"></div>
          <div className="pl-[50px] py-[50px] mobile:pl-[30px]">
            <div className="flex items-start gap-x-[30px] mb-[40px] mobile:gap-x-[15px]">
              <img
                className="tablet:ml-[-15px]"
                src="./images/tel-contact.svg"
                alt=""
              />
              <div>
                <h4 className="text-[18px] font-semibold mb-[15px] text-white mobile:text-[16px] mobile:mb-[5px] ">
                  Contact:
                </h4>
                <a
                  href="tel: +1 (224) 532-5666"
                  className=" text-[18px] font-medium text-white mb-1 mobile:w-[250px]"
                >
                  +1 (224) 532-5666
                </a>{" "}
                <br />
                {/* <a
                  href="tel: +1 (224) 313-0103"
                  className=" text-[18px] font-medium text-white mobile:w-[250px] mobile:text-[13px]"
                >
                  +1 (224) 313-0103
                </a> */}
              </div>
            </div>
            <div className="flex items-start  gap-x-[30px] mb-[40px] mobile:gap-x-[15px]">
              <img
                className="tablet:ml-[-15px]"
                src="./images/mail_logo.svg"
                alt="mail"
                width={40}
                height={40}
              />
              <div>
                <h4 className="text-[18px] font-semibold mb-[15px] text-white mobile:text-[16px] mobile:mb-[5px] ">
                  Email:
                </h4>
                <a
                  href="mailto: info@eztransgroup.com"
                  className="text-[18px] font-medium text-white mobile:text-[13px] "
                >
                  info@eztransgroup.com
                </a>
              </div>
            </div>
            <div className="flex items-start  gap-x-[30px] mb-[40px] mobile:gap-x-[15px]">
              <img
                className="tablet:ml-[-15px]"
                src="./images/adres-contact.svg"
                alt="kkk"
              />
              <div>
                <h4 className="text-[18px] font-semibold mb-[15px] text-white mobile:text-[16px] mobile:mb-[5px] ">
                  Location:
                </h4>
                <p className="w-[350px] text-[18px] font-medium text-white tablet:w-full mobile:w-[250px] mobile:text-[13px]">
                  1019 Thorndale Ct Unit A2, Wheeling, IL 60090
                </p>
              </div>
            </div>

            <div className="flex items-start gap-x-[30px]  mobile:gap-x-[15px]">
              <img
                className="tablet:ml-[-15px]"
                src="./images/deadline-contact.svg"
                alt=""
              />
              <div>
                <h4 className="text-[18px] font-semibold mb-[15px] text-white mobile:text-[16px] mobile:mb-[5px] ">
                  Working hours:
                </h4>
                <p className="w-[409px] text-[18px] font-medium text-white mb-1 mobile:w-[250px]">
                  24/7/365
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primaryClr"></div>
        </div>
      )}
      <Modal showModal={showModal} onClose={closeModal} />
    </div>
  );
};

export default Contact;
