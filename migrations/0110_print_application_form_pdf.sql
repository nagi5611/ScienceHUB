-- Immutable application form PDF stored in R2 at submission time.
ALTER TABLE print_reservations ADD COLUMN application_form_pdf_r2_key TEXT;
