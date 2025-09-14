-- Seed projects
INSERT INTO projects (name, location, status, start_date, end_date)
VALUES
  ('Sai Residency Apartments', 'Brahmapur, Ganjam, Odisha', 'ongoing', '2024-01-10', '2025-12-30'),
  ('Utkal Heights', 'Patia, Bhubaneswar, Odisha', 'planned', '2025-03-01', '2027-06-30'),
  ('Jagannath Enclave', 'Chandrasekharpur, Bhubaneswar, Odisha', 'completed', '2022-05-01', '2024-08-31');

-- Seed tenants
INSERT INTO tenants (project_id, name, contact)
VALUES
  (1, 'Ramesh Sahu', 'ramesh.sahu@example.com'),
  (1, 'Priya Das', 'priya.das@example.com'),
  (2, 'Ankit Mishra', 'ankit.mishra@example.com'),
  (3, 'Sasmita Rout', 'sasmita.rout@example.com');

-- Seed payments
INSERT INTO payments (project_id, tenant_id, amount, due_date, paid_at, status)
VALUES
  (1, 1, 500000.00, '2025-01-15', '2025-01-20', 'paid'),
  (1, 2, 750000.00, '2025-02-10', NULL, 'pending'),
  (2, 3, 1200000.00, '2025-06-01', NULL, 'pending'),
  (3, 4, 800000.00, '2024-06-10', '2024-06-15', 'paid');

-- Seed documents
INSERT INTO documents (project_id, file_path, uploaded_at)
VALUES
  (1, '/docs/sai_residency_agreement.pdf', NOW()),
  (2, '/docs/utkal_heights_brochure.pdf', NOW()),
  (3, '/docs/jagannath_enclave_completion.pdf', NOW());