"use client"

import Image from "next/image"
import Link from "next/link"

export default function Lab1() {
    return (
        <div id="wd-lab1">
            <h1>Abhijith Pandiri - Section 04</h1>
            <h2>Lab Assignments</h2>
            <ul>
                <li><Link href="/Labs/Lab1">Lab 1: HTML Examples</Link></li>
                <li><Link href="/Labs/Lab2">Lab 2: CSS Basics</Link></li>
                <li><Link href="/Labs/Lab3">Lab 3: JavaScript Fundamentals</Link></li>
            </ul>
            <h2>Kambaz</h2>
            <Link href="/">Back to Kambaz</Link>
            <h2>Source code repositories</h2>
            <ul>
                <li><a href="https://github.com/Abhi-2306/fa25-kambaz-next-js">Github Repository - fa25-kambaz-next-js</a></li>
            </ul>
            <h2>Lab 1</h2>
            <h3>HTML Examples</h3>
            <div id="wd-h-tag">
                <h4>Heading Tags</h4>
                Text documents are often broken up into several sections
                and subsections. Each section is usually prefaced with
                a short title or heading that attempts to summarize
                the topic of the section it precedes. For instance
                this paragraph is preceded by the heading Heading
                Tags. The font of the section headings are usually
                larger and bolder than the plain text and their
                subsection headings. This document uses headings to
                introduce topics such as HTML Documents, HTML Tags,
                Heading Tags, etc. HTML heading tags can be used to
                format plain text so that it renders in a browser as
                large headings. There are 6 heading tags for different
                sizes: h1, h2, h3, h4, h5, and h6. Tag h1 is the
                largest heading and h6 is the smallest heading.
            </div>
            <div id="wd-p-tag">
                <h4>Paragraph Tag</h4>
                <p id="wd-p-1">
                    This is a paragraph. We often separate a long set
                    of sentences with vertical spaces to make the text
                    easier to read. Browsers ignore vertical white spaces
                    and render all the text as one single set of sentences.
                    To force the browser to add vertical spacing, wrap the
                    paragraphs you want to separate with the paragraph tag.
                </p>
                <p id="wd-p-2">
                    This is the first paragraph. The paragraph tag is used to format
                    vertical gaps between long pieces of text like this one.
                </p>
                <p id="wd-p-3">
                    This is the second paragraph. Even though there is a deliberate white
                    gap between the paragraph above and this paragraph, by default
                    browsers render them as one contiguous piece of text as shown here on
                    the right.
                </p>
                <p id="wd-p-4">
                    This is the third paragraph. Wrap each paragraph with the paragraph
                    tag to tell browsers to render the gaps.
                </p>

            </div>
            <div id="wd-lists">
                <h4>List Tags</h4>
                <h5>Ordered List Tags</h5>
                How to make Chocolate Milkshake (My favorite recipe):
                <ol id="wd-chocolate-milkshake">
                    <li>Add chocolate, milk, sugar, cocoa powder to a jar.</li>
                    <li>Blend them well.</li>
                    <li>Check the thickness and sweetness.</li>
                    <li>Add some more ingredients if needed.</li>
                    <li>Pour the well blended mixture into a glass.</li>
                    <li>Garnish the shake with some chocolate chips and your favorite chocolate on top.</li>
                    <li>Share and drink along with your family and friends!</li>
                </ol>
                <h5>Unordered List Tag</h5>
                My favorite books (in no particular order)
                <ul id="wd-my-books">
                    <li>Dune</li>
                    <li>Lord of the Rings</li>
                    <li>Ender&apos;s Game</li>
                    <li>Red Mars</li>
                    <li>The Forever War</li>
                </ul>
                Your Favorite books (in no particular order)
                <ul id="wd-your-books">
                    <li>Rings of Fire</li>
                    <li>Alchemist</li>
                    <li>Nothing lasts for ever</li>
                    <li>Angel of the dark</li>
                    <li>Ikigai</li>
                    <li>Thank you for leaving me</li>
                </ul>
            </div>
            <div id="wd-tables">
                <h4>Table Tag</h4>
                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>Quiz</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Q1</td>
                            <td>HTML</td>
                            <td>2/3/21</td>
                            <td>85</td>
                        </tr>
                        <tr>
                            <td>Q2</td>
                            <td>CSS</td>
                            <td>2/10/21</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Q3</td>
                            <td>JavaScript</td>
                            <td>2/17/21</td>
                            <td>95</td>
                        </tr>
                        <tr>
                            <td>Q4</td>
                            <td>ReactJS</td>
                            <td>2/24/21</td>
                            <td>98</td>
                        </tr>
                        <tr>
                            <td>Q5</td>
                            <td>NodeJS</td>
                            <td>3/3/21</td>
                            <td>84</td>
                        </tr>
                        <tr>
                            <td>Q6</td>
                            <td>MongoDB</td>
                            <td>3/10/21</td>
                            <td>88</td>
                        </tr>
                        <tr>
                            <td>Q7</td>
                            <td>ExpressJS</td>
                            <td>3/17/21</td>
                            <td>92</td>
                        </tr>
                        <tr>
                            <td>Q8</td>
                            <td>NextJS</td>
                            <td>3/24/21</td>
                            <td>93</td>
                        </tr>
                        <tr>
                            <td>Q9</td>
                            <td>TailwindCSS</td>
                            <td>3/31/21</td>
                            <td>81</td>
                        </tr>
                        <tr>
                            <td>Q10</td>
                            <td>GitHub</td>
                            <td>4/7/21</td>
                            <td>80</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>Average</td>
                            <td>88.6</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div id="wd-images">
                <h4>Image tag</h4>
                Loading an image from the internet:
                <br />
                <Image alt="" id="wd-starship" height={400} width={400} src={"https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"} />
                <br />
                Loading a local image:
                <br />
                <Image alt="" id="wd-teslabot" src="/images/teslabot.jpg" width={400} height={400} />
            </div>
            <div id="wd-forms">
                <h4>Form Elements</h4>
                <form id="wd-text-fields" >
                    <h5>Text Fields</h5>
                    <label htmlFor="wd-text-fields-username">Username:</label>
                    <input suppressHydrationWarning={true}  placeholder="jdoe" id="wd-text-fields-username" />
                    <br />
                    <label htmlFor="wd-text-fields-password">Password:</label>
                    <input suppressHydrationWarning={true} type="password" defaultValue="123@#$asd" id="wd-text-fields-password" />
                    <br />
                    <label htmlFor="wd-text-fields-first-name">First name:</label>
                    <input suppressHydrationWarning={true} type="text" title="John" id="wd-text-fields-first-name" />
                    <br />
                    <label htmlFor="wd-text-fields-last-name">Last name:</label>
                    <input suppressHydrationWarning={true} type="text" placeholder="Doe"
                        defaultValue="Wonderland"
                        title="The last name"
                        id="wd-text-fields-last-name" />
                    <br />
                    <h5>Text boxes</h5>
                    <label>Biography:</label>
                    <br />
                    <textarea suppressHydrationWarning={true} id="wd-textarea" defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Corporis temporibus odio iste magnam sed
                        natus rem dolorem doloribus provident dolore vero
                        saepe dignissimos dolores nostrum accusantium
                        beatae amet, dolorum porro?" cols={30} rows={10} />
                </form>
            </div>
            <h5 id="wd-buttons">Buttons</h5>
            <div>
                <button suppressHydrationWarning={true} type="button"
                    onClick={() => alert("Life is Good!")}
                    id="wd-all-good">
                    Hello World!
                </button>
            </div>
            <div>
                <h5 id="wd-radio-buttons">Radio buttons</h5>

                <label>Favorite movie genre:</label>
                <br />

                <input suppressHydrationWarning={true} type="radio" name="radio-genre" id="wd-radio-comedy" />
                <label htmlFor="wd-radio-comedy">Comedy</label>
                <br />

                <input suppressHydrationWarning={true} type="radio" name="radio-genre" id="wd-radio-drama" />
                <label htmlFor="wd-radio-drama">Drama</label>
                <br />

                <input suppressHydrationWarning={true} type="radio" name="radio-genre" id="wd-radio-scifi" />
                <label htmlFor="wd-radio-scifi">Science Fiction</label>
                <br />

                <input suppressHydrationWarning={true} type="radio" name="radio-genre" id="wd-radio-fantasy" />
                <label htmlFor="wd-radio-fantasy">Fantasy</label>
            </div>
            <div>
                <h5 id="wd-checkboxes">Checkboxes</h5>
                <label>Favorite movie genre:</label>
                <br />

                <input suppressHydrationWarning={true} type="checkbox" name="check-genre" id="wd-chkbox-comedy" />
                <label htmlFor="wd-chkbox-comedy">Comedy</label>
                <br />

                <input suppressHydrationWarning={true} type="checkbox" name="check-genre" id="wd-chkbox-drama" />
                <label htmlFor="wd-chkbox-drama">Drama</label>
                <br />

                <input suppressHydrationWarning={true} type="checkbox" name="check-genre" id="wd-chkbox-scifi" />
                <label htmlFor="wd-chkbox-scifi">Science Fiction</label>
                <br />

                <input suppressHydrationWarning={true} type="checkbox" name="check-genre" id="wd-chkbox-fantasy" />
                <label htmlFor="wd-chkbox-fantasy">Fantasy</label>
            </div>
            <div>
                <h4 id="wd-dropdowns">Dropdowns</h4>
                <h5>Select one</h5>
                <label htmlFor="wd-select-one-genre"> Favorite movie genre: </label>
                <br />
                <select suppressHydrationWarning={true} id="wd-select-one-genre" defaultValue="SCIFI">
                    <option value="COMEDY" >Comedy</option>
                    <option value="DRAMA">Drama</option>
                    <option value="SCIFI">Science Fiction</option>
                    <option value="FANTASY">Fantasy</option>
                </select>
                <h5>Select many</h5>
                <label htmlFor="wd-select-many-genre"> Favorite movie genres: </label>
                <br />
                <select suppressHydrationWarning={true}  multiple id="wd-select-many-genre" defaultValue={["COMEDY", "SCIFI"]}>
                    <option value="COMEDY">Comedy</option>
                    <option value="DRAMA">Drama</option>
                    <option value="SCIFI">Science Fiction</option>
                    <option value="FANTASY">Fantasy</option>
                </select>
            </div>
            <div>
                <h4>Other HTML field types</h4>

                <label htmlFor="wd-text-fields-email"> Email: </label>
                <input suppressHydrationWarning={true} type="email"
                    placeholder="jdoe@somewhere.com"
                    id="wd-text-fields-email" />
                <br />

                <label htmlFor="wd-text-fields-salary-start"> Starting salary:</label>
                <input suppressHydrationWarning={true} type="number"
                    defaultValue="100000"
                    placeholder="1000"
                    id="wd-text-fields-salary-start" />
                <br />

                <label htmlFor="wd-text-fields-rating"> Rating: </label>
                <input suppressHydrationWarning={true} type="range"
                    defaultValue="4"
                    max="5"
                    placeholder="Doe"
                    id="wd-text-fields-rating" />
                <br />

                <label htmlFor="wd-text-fields-dob"> Date of birth: </label>
                <input suppressHydrationWarning={true} type="date"
                    defaultValue="2000-01-21"
                    id="wd-text-fields-dob" />
                <br />
            </div>
            <div>
                <h4>Anchor tag</h4>
                Please
                <a href="https://www.lipsum.com" id="wd-lipsum"> click here </a>
                to get dummy text<br />
            </div>



        </div>
    )
}