"""one_role_per_user

Revision ID: 89c567c7f2b2
Revises: e38ea1491d9f
Create Date: 2024-12-31 17:48:26.566366

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '89c567c7f2b2'
down_revision: Union[str, None] = 'e38ea1491d9f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    userroles_enum = sa.Enum('ADMIN', 'PRODUCTION_USER', 'TRADING_USER', 'AUDIT_USER', name='userrolestype')
    userroles_enum.create(op.get_bind(), checkfirst=True)

    op.add_column('registry_user', sa.Column('role', userroles_enum, nullable=False))
    op.drop_column('registry_user', 'roles')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('registry_user', sa.Column('roles', postgresql.ARRAY(sa.VARCHAR()), autoincrement=False, nullable=True))
    op.drop_column('registry_user', 'role')
    # ### end Alembic commands ###