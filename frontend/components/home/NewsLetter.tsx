

const NewsLetter = () => {
    return (
        <section className="w-full h-auto lg:px-20 md:px-8 px-1 my-20">
            <main className="w-full h-[500px] rounded-lg patteredSub md:p-12 p-6">
                <div className="w-full h-full flex flex-col justify-center items-center border-2 rounded-lg border-color1/50 bg-color2 px-3">
                    <h1 className="lg:text-5xl md:text-3xl text-3xl text-gray-100 font-bold mb-3">Our Newsletter</h1>
                    <p className="text-gray-300 text-center text-lg">Subscribe to our newsletter today and be  the first to get our latest update</p>

                    <form className="w-full flex md:flex-row flex-col gap-1 md:gap-0 items-stretch lg:px-16 md:px-8 px-3 mt-8">
                        <div className="w-full flex-1">
                            <input type="email" name="email" id="email" placeholder="Enter your email" className="w-full caret-color1 py-3 px-4 outline-none rounded-s-lg rounded-e-lg md:rounded-e-none" />
                        </div>
                        <button type="submit" className="bg-color1 py-3 px-8 hover:bg-[#413511] font-medium rounded-s-lg md:rounded-s-none rounded-e-lg text-white">Subscribe</button>
                    </form>
                </div>
            </main>
        </section>
    )
}

export default NewsLetter