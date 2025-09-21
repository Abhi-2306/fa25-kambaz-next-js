"use client"
export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><b>Assignment Name</b></label>
            <br />
            <br />
            <input suppressHydrationWarning={true} id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
            <textarea suppressHydrationWarning={true} id="wd-description" defaultValue={"The assignment is available online Submit a link to the landing page of"}/>
            <br />
            <br />
            <table>
                <tbody>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                            <input suppressHydrationWarning={true} type = "number" id="wd-points" defaultValue={100} />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                            <select suppressHydrationWarning={true} id="wd-group" defaultValue='ASSIGNMENTS'>
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                            <select suppressHydrationWarning={true} id="wd-display-grade-as" defaultValue='PERCENTAGE'>
                            <option value="PERCENTAGE">Percentage</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                            <select suppressHydrationWarning={true} id="wd-submission-type" defaultValue='ONLINE'>
                            <option value="ONLINE">Online</option>
                            </select>
                            <br /><br />

                        <label>Online Entry Options</label><br />
                        <input suppressHydrationWarning={true} type="checkbox" id="wd-text-entry" />
                        <label htmlFor="wd-text-entry">Text Entry</label><br />

                        <input suppressHydrationWarning={true} type="checkbox" id="wd-website-url" />
                        <label htmlFor="wd-website-url">Website URL</label><br />

                        <input suppressHydrationWarning={true} type="checkbox" id="wd-media-recordings" />
                        <label htmlFor="wd-media-recordings">Media Recordings</label><br />

                        <input suppressHydrationWarning={true} type="checkbox" id="wd-student-annotation" />
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br />

                        <input suppressHydrationWarning={true} type="checkbox" id="wd-file-upload" />
                        <label htmlFor="wd-file-upload">File Uploads</label><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to">Assign</label>
                    </td>
                    <td>
                        <label htmlFor="wd-assign-to">Assign to</label><br />
                            <input suppressHydrationWarning={true} id="wd-assign-to" defaultValue={"Everyone"} />
                            <br /><br />
                        <label htmlFor="wd-due-date">Due</label><br />
                            <input suppressHydrationWarning={true} type="date" id="wd-due-date" defaultValue={"2024-04-13"} />
                            <br /><br />
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="wd-available-from">Available from</label><br />
                                            <input suppressHydrationWarning={true} type="date" id="wd-available-from" defaultValue="2024-05-06"/>
                                    </td>
                                    <td>
                                        <label htmlFor="wd-available-until">Until</label><br />
                                            <input suppressHydrationWarning={true} type="date" id="wd-available-until" defaultValue="2024-05-20"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                        <td colSpan={2}>
                            <hr />
                        </td>
                </tr>
                <tr>
                    <td colSpan={2} align="right">
                            <button suppressHydrationWarning={true} id="wd-cancel">Cancel</button>
                            <button suppressHydrationWarning={true} id="wd-save">Save</button>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

