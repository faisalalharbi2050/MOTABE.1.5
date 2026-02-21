import { 
    TimetableData, Teacher, Subject, ClassInfo, SchoolInfo 
} from '../types';
import { getKey } from './scheduleInteractive';

// XML Export for "Fet" or Chrome Extension?
// The user mentioned "XML Export for Chrome Extension".
// We'll create a generic structure that captures all data.

export function generateExtensionXML(
    timetable: TimetableData,
    teachers: Teacher[],
    subjects: Subject[],
    classes: ClassInfo[],
    schoolInfo: SchoolInfo
): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>\n<schedule school="${schoolInfo.schoolName || 'School'}">`;
    const footer = `</schedule>`;
    
    let body = '';
    
    // We basically need to dump the Timetable in a structured way.
    // Iterating the timetable map.
    
    for (const [key, slot] of Object.entries(timetable)) {
        // key is "teacherId-day-period"
        // But we need "Class-Day-Period" view as well?
        
        // Let's parse the key
        const [tId, day, pStr] = key.split('-');
        
        const teacher = teachers.find(t => t.id === slot.teacherId);
        const subject = subjects.find(s => s.id === slot.subjectId);
        const cls = classes.find(c => c.id === slot.classId);
        
        if (teacher) {
            body += `
    <slot>
        <teacher id="${teacher.id}">${teacher.name}</teacher>
        <day>${day}</day>
        <period>${pStr}</period>
        <type>${slot.type}</type>
        <subject id="${slot.subjectId || ''}">${subject?.name || ''}</subject>
        <class id="${slot.classId || ''}">${cls?.name || ''}</class>
    </slot>`;
        }
    }
    
    return header + body + '\n' + footer;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
