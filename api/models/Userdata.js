import mongoose from "mongoose";


const uploadSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAACUCAMAAAC+99ssAAAAMFBMVEXk5ueutLeor7Lf4uPn6eqrsbXKztDGysyxt7rS1dfZ3N3c3+DP0tS0ur26v8LAxcfLEUImAAADoElEQVR4nO2bWXLsIAwAWYRZbe5/24c9S8azgjDC9Yr+SOUvXQiBLBTGBoPBYDAYDAaDwWAwGAwwADC5sv12KgDAhbgsc2JZYvAnEgRpF5XgN9Lv0clTCILXs/gzuwmKeTqDX+QvaldBPrGufsCmT26bnwkd9UAuX9w2v9hPzn5buFt4O+0+CL/UNoztoqd/LtwF0UEPJpEnl7DkcnlhvaAc7eqBzV+5FUlqx0yRHF9I5X6dc88ITRdbCIVySc/T6RXLEcYWck+6RxTVseIKU+LCTBNa1NKRXRmAkks7j8Ku5ArbQ3FjwIKUU7q9HDInVub2coiT+Ibw7fUi2k5N7TceOrAkWYvN2IRpbldY2O1pvfFgQm873v7EA3xSJFp/fEOskGuetDDX2LWukIfdf2uHrVBo7M6ds7iy/Urr4h1CzU3WvDp2NXbN2yny1DUKwyetiu3t8Gkh2nfgweIrd4IunkSX7hSNHvz3LMFHDwPsmWIIPhiTHjK0BBm7gvveFkSdbYmpohRJC4phmxWORg5VgjYv7R7sXPHiKSo3hvjmJutpX/TKnlNIGosPFN1nZPl6xxXIETQ9X/RyY6tm4hfGFchsICe5Lk/v/nVI5jxyLKeHTFGtf2RSX/2U6jNQcQXk8nkmRfF+szJXPbDL++23zpH1H9MC5tL6qWc1HjucI+8AYCHORgi1IYRZou07PrYHQHoXdExMwXl5otnFFdjTW+fOJuOdDWHSK1MI1jnZ3TH9dentFA2/ZoW6TX+mn8os2vpeE7QA3uo4r6nw8bzb8iM44gSBVALomb+cI++PZD5TZjBIq3lOAfCHUIt1FCEGqeecNXtewrQPbWO/tGxvZovzV3Bq2EoBNs01Hfd1xLfV3QvyR7mUKRgbrF+6Ss0Bbnyrq46edgNbGdO936FtC/Cx5pXijd+BQ8hgDwrqI/qYAzoV58cu3AV1SMsM3IE7bk99l7ti7OknqvqJQLeI6l2v7ku8sBGGoEavajQmC4M+mduv3Ap29UjkkKNbdRMA+aB6j3UDAGV6xbFFNP3xesVFAeq1Ca1XWJLSpOsdUSaHf15HUdYhJY3rRsFbUN1wJ4aivKWWK/n/BqpzeEf2mYyf6aggtztPv+s2u9xStGY8sUIvrxrwVBfsk13WfdYnsDxz/q1qKraKnNtW9pLLmYIH20suZ3ig27bLmoDrclFcyHmh73ParZjfdtKIbmT0fbzsBcn04GAwGAyK+QfvKzAZES0aUQAAAABJRU5ErkJggg==",
    }
},{
    timestamps: true
})

const Userdata = mongoose.model('Userdata', uploadSchema)

export default Userdata;