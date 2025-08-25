// src/components/LessonCard.js
import React from "react";

export default function LessonCard({ lesson, onSelect }) {
    return (
        <div
            onClick={() => onSelect(lesson)}
            className="border rounded-lg p-4 shadow hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
        >
            <h3 className="text-lg font-bold text-primary">{lesson.title}</h3>
            {lesson.level && (
                <p className="text-sm text-gray-500">Seviye: {lesson.level.name || lesson.level}</p>
            )}
            {lesson.short_description && (
                <p className="text-sm mt-2 text-gray-700">{lesson.short_description}</p>
            )}
        </div>
    );
}
