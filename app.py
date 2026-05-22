from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "change-me-in-production"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    name    = request.form.get("name", "").strip()
    email   = request.form.get("email", "").strip()
    subject = request.form.get("subject", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not email or not message:
        flash("Please fill in all required fields.", "error")
        return redirect(url_for("index") + "#contact")

    # -------------------------------------------------------
    # TODO: replace this block with real email / DB logic
    # e.g. send via smtplib, store in SQLite, forward to an
    # API like SendGrid, etc.
    # -------------------------------------------------------
    print(f"\n--- New Contact Submission ---")
    print(f"Name:    {name}")
    print(f"Email:   {email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}\n")
    # -------------------------------------------------------

    flash("Thanks for reaching out! I'll get back to you within 24 hours.", "success")
    return redirect(url_for("index") + "#contact")


if __name__ == "__main__":
    # debug=True auto-reloads on file changes — turn off for production
    app.run(debug=True, host="0.0.0.0", port=5000)
