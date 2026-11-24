import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

supabase_url = os.environ["SUPABASE_URL"]
supabase_service_role_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(
    supabase_url,
    supabase_service_role_key,
)