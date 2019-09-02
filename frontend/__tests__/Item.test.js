import ItemComponent from "../components/Item"
import { shallow } from "enzyme"
import toJSON from "enzyme-to-json"

const itemProps = {
  id: "ABC123",
  title: "Sick Item",
  price: 4000,
  description: "A super sick item for super sick people!",
  image: "sick.jpg",
  largeImage: "large-sick.jpg"
}

describe("<Item />", () => {
  // A thorough shallow rendering test...

  // const wrapper = shallow(<ItemComponent item={itemProps} />)
  // it("renders the PriceTag and Title properly", () => {
  //   const PriceTag = wrapper.find("PriceTag")
  //   expect(PriceTag.children().text()).toBe("$50")
  //   expect(wrapper.find("Title a").text()).toBe(itemProps.title)
  // })
  // it("renders the image properly", () => {
  //   const img = wrapper.find("img")
  //   expect(img.props().src).toBe(itemProps.image)
  //   expect(img.props().alt).toBe(itemProps.title)
  // })
  // it("renders the buttons properly", () => {
  //   const buttonList = wrapper.find(".buttonList")
  //   expect(buttonList.children()).toHaveLength(3)
  //   expect(buttonList.find("Link").exists()).toBe(true)
  //   expect(buttonList.find("AddToCart").exists()).toBe(true)
  //   expect(buttonList.find("DeleteItem").exists()).toBe(true)
  // })

  it("renders", () => {
    shallow(<ItemComponent item={itemProps} />)
  })
  it("matches the snapshot", () => {
    const wrapper = shallow(<ItemComponent item={itemProps} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
