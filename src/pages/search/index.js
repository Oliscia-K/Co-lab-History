import SearchpageComponent from "../../../components/SearchpageComponent";
import NavigationBarButton from "../../../components/NavigationBarButton";

export default function Search() {
  return (
    <div style={{ display: "flex" }}>
      <NavigationBarButton />
      <div style={{ flexGrow: "1" }}>
        <SearchpageComponent />
      </div>
    </div>
  );
}
