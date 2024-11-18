# Production VPC
resource "aws_vpc" "oi_prod_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "OI_Prod_VPC"
  }
}

# Public subnets
resource "aws_subnet" "public_subnet_1" {
  cidr_block        = var.public_subnet_1_cidr
  vpc_id            = aws_vpc.oi_prod_vpc.id
  availability_zone = var.availability_zones[0]
  tags = {
    Name = "OI_Public_Subnet_1"
  }
}
resource "aws_subnet" "public_subnet_2" {
  cidr_block        = var.public_subnet_2_cidr
  vpc_id            = aws_vpc.oi_prod_vpc.id
  availability_zone = var.availability_zones[1]
  tags = {
    Name = "OI_Public_Subnet_2"
  }
}


# Private subnets
resource "aws_subnet" "private_subnet_1" {
  cidr_block        = var.private_subnet_1_cidr
  vpc_id            = aws_vpc.oi_prod_vpc.id
  availability_zone = var.availability_zones[0]
  tags = {
    Name = "OI_Private_Subnet_1"
  }
}
resource "aws_subnet" "private_subnet_2" {
  cidr_block        = var.private_subnet_2_cidr
  vpc_id            = aws_vpc.oi_prod_vpc.id
  availability_zone = var.availability_zones[1]
  tags = {
    Name = "OI_Private_Subnet_2"
  }
}


# Route tables for the subnets
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.oi_prod_vpc.id
  tags = {
    Name = "OI_Prod_Public_Route_Table"
  }
}
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.oi_prod_vpc.id
  tags = {
    Name = "OI_Prod_Private_Route_Table"
  }
}

# Associate the newly created route tables to the subnets
resource "aws_route_table_association" "public_route_1_association" {
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = aws_subnet.public_subnet_1.id
}
resource "aws_route_table_association" "public_route_2_association" {
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = aws_subnet.public_subnet_2.id
}

resource "aws_route_table_association" "private_route_1_association" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_1.id
}
resource "aws_route_table_association" "private_route_2_association" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_2.id
}


# Elastic IP
resource "aws_eip" "elastic_ip_for_nat_gw" {
  associate_with_private_ip = "10.0.0.5"
  depends_on                = [aws_internet_gateway.oi_prod_igw]
}

# NAT gateway
resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.elastic_ip_for_nat_gw.id
  subnet_id     = aws_subnet.public_subnet_1.id
  depends_on    = [aws_eip.elastic_ip_for_nat_gw]
}
resource "aws_route" "nat_gw_route" {
  route_table_id         = aws_route_table.private_route_table.id
  nat_gateway_id         = aws_nat_gateway.nat_gw.id
  destination_cidr_block = "0.0.0.0/0"
}

# Internet Gateway for the public subnet
resource "aws_internet_gateway" "oi_prod_igw" {
  vpc_id = aws_vpc.oi_prod_vpc.id
  tags = {
    Name = "OI_Prod_Internet_Gateway"
  }
}

# Route the public subnet traffic through the Internet Gateway
resource "aws_route" "public_internet_igw_route" {
  route_table_id         = aws_route_table.public_route_table.id
  gateway_id             = aws_internet_gateway.oi_prod_igw.id
  destination_cidr_block = "0.0.0.0/0"
}
