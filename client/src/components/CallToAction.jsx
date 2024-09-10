import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="flex p-3 text-sm font-serif border rounded-lg shadow-sm">
        <div className="border-r p-3 flex flex-col gap-3 justify-around pr-6 flex-[2]">
            <h2 className="text-xl font-semibold">SUBSCRIBE</h2>
            <h3 className="text-lg font-sans">Newsletter</h3>
            <p>Subscribe to my monthly newsletter for a roundup of my latest blog posts, insights on my tech learning journey, reflections on mental health, and practical life tips I've discovered along the way.</p>
            <form className="flex flex-col gap-3">
                <input type="email" placeholder="Email address" />
                <Button color="dark" size="sm" className="font-sans">SUBSCRIBE</Button>
            </form>
        </div>
        <div className="flex flex-col p-3 gap-3 justify-between ml-3 flex-1">
            <h4 className="text-base font-semibold">About the author</h4>
            <img src="https://cdn.pixabay.com/photo/2015/03/03/08/55/portrait-657116_1280.jpg" alt="Jasmine" className="w-24 h-24 rounded-full self-center"></img>
            <p>Jasmine Wu is an aspiring software engineer currently focusing on fron-end development. She cares about mental health and likes being nerdy on everyday topics.</p>
            <Link>Read more &rarr;</Link>
        </div>
    </div>
  )
}
