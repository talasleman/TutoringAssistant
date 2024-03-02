from fastapi import FastAPI, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai_assistant import completion
from openai import OpenAI
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Student(BaseModel):
    studentName: str
    grade: str
    topic: str
    theme: str
    notes: str

@app.post("/submit-form/")
async def submit_form(student: Student):
    client = OpenAI()

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a teacher, skilled in creating presonalized booklets for your students. You follow all instructions to the letter and never forget any detail."},
        {"role": "user", "content": f"Create a booklet adapted to all the characteristics of your student. This booklet should contain short exercises to help the student learn {student.topic}. Their name is {student.studentName}. Their grade is {student.grade}. The topic they want to study is {student.topic}. The theme of the booklet is {student.theme}. These are extra notes to take into consideration about the student, you can use this information to make the booklet more personalized. {student.notes}"}
    ]
    )
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    textobject = c.beginText(40, 750)
    textobject.setFont("Helvetica", 10)
    textobject.textLines(completion.choices[0].message.content)
    c.drawText(textobject)
    c.showPage()
    c.save()
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="application/pdf")

# @app.get("/api/message")
# async def read_message():
#     return {"message": completion.choices[0].message.content}

