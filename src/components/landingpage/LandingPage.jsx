import React from "react";
import Header from "../NavAndFooter/header";
import Footer from "../NavAndFooter/Footer";
import "./LandingPage.css"

function LandingPage(){
    return(
        <div className="landing-page">

            <Header />

            <main className="content">
                <h1 className="text-center mt-5">Welcome to the Landing Page</h1>
                <p className="text-center">This is your main area content.</p>
            </main>

            <Footer />

        </div>
    )
}

export default LandingPage;
