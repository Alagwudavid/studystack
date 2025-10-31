-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for counting)
CREATE POLICY "Allow public read access for waitlist count" 
ON waitlist FOR SELECT 
USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access for waitlist" 
ON waitlist FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public update access (for status changes)
CREATE POLICY "Allow public update access for waitlist status" 
ON waitlist FOR UPDATE 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON waitlist 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO waitlist (email, status) VALUES 
-- ('test1@example.com', 'pending'),
-- ('test2@example.com', 'confirmed'),
-- ('test3@example.com', 'pending');