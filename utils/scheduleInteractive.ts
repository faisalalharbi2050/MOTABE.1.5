import { TimetableData, TimetableSlot, Teacher, ScheduleSettingsData } from '../types';
import { validateAllConstraints } from './scheduleConstraints'; // Reuse validation if needed

// Helper to generate key
export const getKey = (teacherId: string, day: string, period: number) => `${teacherId}-${day}-${period}`;

// Define Swap Action Result
export interface SwapResult {
    success: boolean;
    reason?: string;
    newTimetable?: TimetableData;
    isChain?: boolean;
    chainSteps?: string[]; // Description of chain: "A -> B, B -> C, C -> A"
    relatedTeacherIds?: string[];
}

// 1. Simple Move/Swap
export function tryMoveOrSwap(
    timetable: TimetableData,
    source: { teacherId: string; day: string; period: number },
    target: { teacherId: string; day: string; period: number },
    settings: ScheduleSettingsData
): SwapResult {
    const sourceKey = getKey(source.teacherId, source.day, source.period);
    const targetKey = getKey(target.teacherId, target.day, target.period);
    
    const sourceSlot = timetable[sourceKey];
    const targetSlot = timetable[targetKey];
    
    if (!sourceSlot) {
        return { success: false, reason: "المصدر فارغ" };
    }
    
    // Creating new timetable state
    const newTimetable = { ...timetable };
    
    // Move Source -> Target
    newTimetable[targetKey] = { ...sourceSlot, teacherId: target.teacherId }; // Assign to new teacher
    
    // Move Target -> Source (if exists)
    if (targetSlot) {
        newTimetable[sourceKey] = { ...targetSlot, teacherId: source.teacherId };
    } else {
        delete newTimetable[sourceKey];
    }
    
    // A simple move/swap means:
    // Source Teacher (T1) gives up Slot1, takes Slot2 (from T2).
    // Target Teacher (T2) gives up Slot2, takes Slot1 (from T1).

    // Let's validate if this is mathematically possible based on the user's rules:
    // User wants: Move T1's session (C1) to T2's spot.
    
    // Check 1: Can T1 teach at target time?
    // - Is T1 already busy at target time? (They are moving their *only* class at that time to another time, but what if they are dragging a class from Monday to Tuesday, and they already have a class on Tuesday at that time?)
    // In our UI, they drag a specific slot. They drag T1-Day1-Period1 to T2-Day2-Period2.
    // If Day1 == Day2 and Period1 == Period2, T1 is just swapping with T2. T1 is suddenly free at Day1-Period1, and busy at Day2-Period2. Wait, if it's the same time, they are just swapping classes.
    // If different times, T1 must be free at Day2-Period2 (currently held by T2). Wait, T1 dragging to T2's cell implies T1 will take T2's cell time. Is T1 free at T2's time?
    if (source.teacherId === target.teacherId) {
       // Moving within same teacher's schedule. This is always safe regarding teacher availability.
       // E.g. T1 moves class from P1 to P2. P2 might have another class. They just swap.
    } else {
       // Dragging T1's class to T2's cell.
       // Means T1 wants to teach C1 at T2's time.
       // AND T2 wants to teach C2 at T1's time.
       const t1TargetKey = getKey(source.teacherId, target.day, target.period);
       const t2SourceKey = getKey(target.teacherId, source.day, source.period);
       
       if (timetable[t1TargetKey] && timetable[t1TargetKey].classId !== targetSlot?.classId) {
            return { success: false, reason: `المعلم المرسل مشغول في نفس الوقت المختار (${target.day} - ${target.period}) ولا يمكنه تبادل الحصص.` };
       }
       if (targetSlot && timetable[t2SourceKey]) {
            return { success: false, reason: `المعلم المستقبل مشغول في وقت حصة المعلم المرسل (${source.day} - ${source.period}).` };
       }
    }

    // Check 2: Class Conflict for the new time slots
    // If T1 teaches C1 at target time, is C1 busy at target time?
    // C1 is moving to target time. Who is teaching C1 at target time right now?
    if (sourceSlot.classId) {
        const c1TargetSlotOccupant = Object.entries(timetable).find(([k, s]) => 
            k.includes(`-${target.day}-${target.period}`) && s.classId === sourceSlot.classId && k !== targetKey
        );
        if (c1TargetSlotOccupant) {
            return { success: false, reason: `الفصل (${sourceSlot.classId}) لديه حصة أخرى في نفس الوقت المختار.` };
        }
    }

    // If T2 (if exists) teaches C2 at source time, is C2 busy at source time?
    if (targetSlot && targetSlot.classId) {
        const c2SourceSlotOccupant = Object.entries(timetable).find(([k, s]) => 
             k.includes(`-${source.day}-${source.period}`) && s.classId === targetSlot.classId && k !== sourceKey
        );
        if (c2SourceSlotOccupant) {
             return { success: false, reason: `الفصل (${targetSlot.classId}) لديه حصة أخرى في الوقت الأصلي.` };
        }
    }

    // Validate (Simplified: check if teachers are available in new slots)
    // In a real app, we'd run `validateAllConstraints` mostly on the affected teachers.
    
    return { 
        success: true, 
        newTimetable,
        chainSteps: [
            `تبديل مباشر: ${sourceSlot.classId || ''} (${source.day} ح${source.period}) <-> ${targetSlot?.classId || 'فراغ'} (${target.day} ح${target.period})`
        ],
        relatedTeacherIds: [source.teacherId, target.teacherId]
    };
}

// 2. Chain Swap (Smart 3-way)
// Scenario: User wants to move T1 from SlotA to SlotB.
// SlotB is occupied by T2.
// T2 usually goes to SlotA (Swap).
// BUT if T2 cannot go to SlotA (Constraint), maybe T2 can go to SlotC (occupied by T3), and T3 goes to SlotA.
// T1 -> SlotB (pushes T2)
// T2 -> SlotC (pushes T3)
// T3 -> SlotA (fills T1's old spot)

export function findChainSwap(
    timetable: TimetableData,
    source: { teacherId: string; day: string; period: number },
    target: { teacherId: string; day: string; period: number },
    allTeachers: Teacher[],
    settings: ScheduleSettingsData
): SwapResult | null {
    
    const sourceKey = getKey(source.teacherId, source.day, source.period);
    const targetKey = getKey(target.teacherId, target.day, target.period);
    
    const slotA = timetable[sourceKey]; // T1's session
    const slotB = timetable[targetKey]; // T2's session
    
    if (!slotA || !slotB) return null;

    // 1. Same Teacher Chain (Time Swap Triangle)
    if (source.teacherId === target.teacherId) {
        const teacherId = source.teacherId;
        const day = source.day; // Assuming same day for now, but can be diff day
        
        // Iterate all other slots of this teacher to find a 3rd one
        // We want: A -> Slot2, B -> Slot3, C -> Slot1
        // We know A is at Slot1 (Source), B is at Slot2 (Target).
        // checks:
        // 1. Can Slot1's class go to Slot2? (Checked by user dragging)
        // 2. Can Slot2's class (B) go to Slot3?
        // 3. Can Slot3's class (C) go to Slot1?
        
        // Let's filter slots for this teacher on this day (or all week)
        const teacherSlots = Object.entries(timetable).filter(([k, s]) => 
            s.teacherId === teacherId && k !== sourceKey && k !== targetKey
        );
        
        for (const [key3, slotC] of teacherSlots) {
            // key3 implies P3
            // Check B -> Slot3 (Key3)
            // Check C -> Slot1 (SourceKey)
            
            // Simplified validation: Validation should be done properly, but here we check basic feasibility
            // For rigorous check, we'd need to run `validateAllConstraints` for each step.
            // Here we just propose the chain.
            
            return {
                success: true,
                isChain: true,
                chainSteps: [
                    `${slotA.classId || 'H1'} -> ${source.day} ${source.period} to ${target.day} ${target.period}`,
                    `${slotB.classId || 'H2'} -> ${target.day} ${target.period} to ${key3.split('-')[2]}`,
                    `${slotC.classId || 'H3'} -> ${key3.split('-')[2]} to ${source.day} ${source.period}`
                ],
                newTimetable: (() => {
                    const nt = { ...timetable };
                    nt[targetKey] = { ...slotA, teacherId: teacherId }; // A -> Slot2
                    nt[key3] = { ...slotB, teacherId: teacherId };      // B -> Slot3
                    nt[sourceKey] = { ...slotC, teacherId: teacherId }; // C -> Slot1
                    return nt;
                })(),
                relatedTeacherIds: [teacherId]
            };
        }
    }
    
    // 2. Different Teacher Chain (Reassignment Triangle)
    // T1 (A) connects to T2 (B).
    // T1 takes B? No, simple swap failed (assumed).
    // T1 takes C? T3 takes B?
    // Try to find T3 who can take B, and T1 takes C (from T3).
    // A -> T2
    // B -> T3
    // C -> T1
    
    if (source.teacherId !== target.teacherId) {
         // This is expensive to search. We will try for a limited set of teachers (e.g. same subject).
         // Find teachers with same subject as SlotB?
         // This is a "nice to have" deep feature.
         // Implementing a simple version:
         // Iterate 5 random teachers? Or all?
         
         const potentialTeachers = allTeachers.filter(t => t.id !== source.teacherId && t.id !== target.teacherId);
         
         for (const t3 of potentialTeachers) {
             const key3 = getKey(t3.id, target.day, target.period); // Same time slot
             const slotC = timetable[key3];
             
             if (slotC) {
                 // Try triangle:
                 // A -> T2 (Target)
                 // B -> T3 (Key3)
                 // C -> T1 (Source)
                 
                 // Validations (Mental check):
                 // T2 gets A.
                 // T3 gets B.
                 // T1 gets C.
                 
                 return {
                    success: true,
                    isChain: true,
                    chainSteps: [
                        `[${t3.name}] receives class from [${allTeachers.find(t=>t.id===target.teacherId)?.name}]`,
                        `[${allTeachers.find(t=>t.id===source.teacherId)?.name}] receives class from [${t3.name}]`
                    ],
                    newTimetable: (() => {
                        const nt = { ...timetable };
                        nt[targetKey] = { ...slotA, teacherId: target.teacherId }; // A -> T2
                        nt[key3] = { ...slotB, teacherId: t3.id };                 // B -> T3
                        nt[sourceKey] = { ...slotC, teacherId: source.teacherId }; // C -> T1
                        return nt;
                    })(),
                    relatedTeacherIds: [source.teacherId, target.teacherId, t3.id]
                 };
             }
         }
    }

    return null;
}
