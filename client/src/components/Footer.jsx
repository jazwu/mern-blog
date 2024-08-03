import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import React from "react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-gray">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between">
          <div>
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg 
                sm:text-xl font-semibold dark:text-white"
            >
              <span
                className="px-2 py-1 bg-gradient-to-r from-indigo-500 
                via-purple-500 to-pink-500 rounded-lg text-white"
              >
                Jasmine's
              </span>
              Blog
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Jasmine's Portfolio Site</Footer.Link>
                <Footer.Link href="#">Jasmine's Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="Jasmine's Blog" year={new Date().getFullYear()} />
            <div className="mt-4 flex gap-6 sm:mt-0 sm:justify-center">
                <Footer.Icon href="#" icon={BsFacebook} />
                <Footer.Icon href="#" icon={BsInstagram} />
                <Footer.Icon href="#" icon={BsTwitter} />
                <Footer.Icon href="#" icon={BsGithub} />
                <Footer.Icon href="#" icon={BsDribbble} />
            </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterComponent;
