import "./Home.css";
import Aurora from "./Aurora";

export default function Home() {
  return (
    <>
      <div id="background">
        <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={1}
          amplitude={2}
          speed={1}
        />
      </div>

      <main>
        <h1 id="Title">Welcome to Alveron</h1>
      </main>
    </>
  );
}
