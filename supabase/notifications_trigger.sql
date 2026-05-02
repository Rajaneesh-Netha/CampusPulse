-- ============================================================
--  CampusPulse — Auto-Notifications + Feedback Support
--  Run this in Supabase SQL Editor
-- ============================================================

-- ── 1. Add complaint_id to notifications for linking ────────
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS complaint_id TEXT REFERENCES public.complaints(id) ON DELETE CASCADE;

-- ── 2. Expand notification types ────────────────────────────
-- Drop old constraint and add expanded one
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('update','resolved','progress','info','warning','system','feedback_request'));

-- ── 3. Trigger function: create notification on status change ──
CREATE OR REPLACE FUNCTION public.notify_on_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  complaint_title TEXT;
  notif_type TEXT;
  notif_message TEXT;
BEGIN
  -- Only fire when status actually changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  complaint_title := COALESCE(NEW.title, 'your complaint');

  IF NEW.status = 'In Progress' THEN
    notif_type := 'progress';
    notif_message := '🔄 Your complaint "' || complaint_title || '" (' || NEW.id || ') is now being worked on.';
  ELSIF NEW.status = 'Resolved' THEN
    notif_type := 'resolved';
    notif_message := '✅ Your complaint "' || complaint_title || '" (' || NEW.id || ') has been resolved! Please rate your experience.';
  ELSE
    RETURN NEW; -- No notification for other status changes
  END IF;

  -- Insert notification for the student who raised the complaint
  INSERT INTO public.notifications (user_id, type, message, complaint_id, read)
  VALUES (NEW.student_id, notif_type, notif_message, NEW.id, FALSE);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't block status update if notification fails
  RETURN NEW;
END;
$$;

-- ── 4. Create the trigger on complaints table ──────────────
DROP TRIGGER IF EXISTS on_complaint_status_change ON public.complaints;
CREATE TRIGGER on_complaint_status_change
  AFTER UPDATE OF status ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_status_change();

-- ── 5. Ensure feedback table has proper RLS policy ─────────
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow students to insert feedback
DROP POLICY IF EXISTS "Students can insert feedback" ON public.feedback;
CREATE POLICY "Students can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Allow reading feedback
DROP POLICY IF EXISTS "Anyone can read feedback" ON public.feedback;
CREATE POLICY "Anyone can read feedback" ON public.feedback
  FOR SELECT USING (true);

-- ── 6. Allow all operations on notifications ────────────────
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (true);

-- ── 7. Verify ──────────────────────────────────────────────
SELECT 'Trigger created' AS status, tgname
FROM pg_trigger
WHERE tgname = 'on_complaint_status_change';
